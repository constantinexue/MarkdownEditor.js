// "use strict";
var klass = require('klass'),
    when = require('when'),
    pipeline = require('when/pipeline'),
    parallel = require('when/parallel'),
    fs = require('fs'),
    path = require('path'),
    marked = require('marked'),
    http = require('http-get'),
    _ = require('underscore');
_.str = require('underscore.string');

var template = fs.readFileSync('./public/page-temp.html', 'utf8');

function highlightCode(code, lang) {
    var html = '';
    if (!lang) {
        html = '<pre><code>' + code + '\n</code></pre>';
    } else {
        if (lang === 'js') {
            lang = 'javascript';
        }
        html = hljs.highlight(lang, code).value;
        html = '<pre><code class="' + 'lang-' + lang + '">' + html + '\n</code></pre>\n'
    }
    return html;
}

function ImagePathStage() {
    this.preDo = function(href, title, text, fileDir) {
        var start = _.str.startsWith;
        if (start(href, 'http://') || start(href, 'https://') || start(href, 'file://')) {
            // Do nothing
        } else if (fileDir) {
            href = path.join(fileDir, href);
            href = 'file://' + href;
        }
        return {
            href: href,
            title: title,
            text: text
        };
    };
    this.postDo = function(html) {
        return when.resolve(html);
    };
}

function ImageEmbedStage(old) {
    var self = {};
    //self.old = old;
    self.imageMappings = {};
    this.preDo = function(href, title, text) {
        var html, base64, id = _.uniqueId('image_');
        self.imageMappings[id] = href;
        href = '{{' + id + '}}';
        //html = self.old('{{' + id + '}}', title, text);
        //return html;
        return {
            href: href,
            title: title,
            text: text
        };
    };
    this.postDo = function(html) {
        var tasks = [];
        _.pairs(self.imageMappings).forEach(function(mapping) {
            var id = mapping[0],
                src = mapping[1];
            tasks.push(function() {
                var imageDeferred = when.defer();
                if (_.str.startsWith(src, 'file://')) {
                    src = src.substring(7);
                    fs.readFile(src, function(err, data) {
                        if (err) {
                            console.log(err);
                            imageDeferred.reject(err);
                        } else {
                            var base64 = new Buffer(data).toString('base64');
                            self.imageMappings[id] = base64;
                            imageDeferred.resolve(base64);
                        }
                    });
                } else {
                    http.get({
                        url: src,
                        bufferType: "buffer"
                    }, function(err, result) {
                        if (err) {
                            console.log(err);
                            imageDeferred.reject(err);
                        } else {
                            var base64 = new Buffer(result.buffer, 'binary').toString('base64');
                            self.imageMappings[id] = base64;
                            imageDeferred.resolve(base64);
                        }
                    });
                }
                return imageDeferred.promise;
            });
        });
        return parallel(tasks).then(function() {
            _.pairs(self.imageMappings).forEach(function(mapping) {
                var id = '{{' + mapping[0] + '}}',
                    src = 'data:image/png;base64,' + mapping[1];
                html = html.replace(id, src);
            });
            return when.resolve(html);
        });
    };
}

function ImagePipeline(stages, fileDir, origin) {
    var self = this;
    self.stages = stages;
    self.execute = function(href, title, text) {
        var param = {
            href: href,
            title: title,
            text: text
        };
        self.stages.forEach(function(stage) {
            param = stage.preDo(param.href, param.title, param.text, fileDir);
        });
        return origin(param.href, param.title, param.text);
    };
    self.deal = function(html) {
        var tasks = [];
        self.stages.forEach(function(stage) {
            tasks.push(function() {
                return stage.postDo(html);
            });
        });
        return pipeline(tasks);
    };
}

function markdown(md, options) {
    var deferred = when.defer();
    marked.parse(md, options, function(err, html) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(html);
        }
    });
    return deferred.promise;
}

var CompileService = klass(function(themeService) {
    this.options = {
        theme: 'article-cn',
        highlightCode: true,
        embedImage: false
    };
    this.themeService = themeService;
}).methods({
    getOptions: function() {
        return this.options;
    },
    setOptions: function(value) {
        this.options = value;
        return this;
    },
    compile: function(currentFile, text) {
        var self = this,
            fileDir = path.dirname(currentFile),
            renderer = new marked.Renderer(),
            stages, imagePipeline;
        if (self.options.highlightCode) {
            //renderer.code = highlightCode;
        }
        stages = [new ImagePathStage()];
        if (self.options.embedImage) {
            stages.push(new ImageEmbedStage());
        } else {}
        imagePipeline = new ImagePipeline(stages, fileDir, renderer.image);
        renderer.image = imagePipeline.execute;

        // Adds a target="_system" to <a>, preventing open link in node-webkit.
        // This feature needs adding a javascript file into template.
        if (self.options.safeLink) {
            renderer.link = function() {
                // TODO
            };
        }

        return markdown(text, {
            renderer: renderer
        }).then(function(body) {
            // Embeds base64 image to HTML
            return imagePipeline.deal(body);
        }).then(function(body) {
            var style = self.themeService.retrieve(self.options.theme),
                // TODO: Considering use _.template to instead of string.replace
                html = template.replace('{{style}}', style).replace('{{body}}', body);
            return when.resolve(html);;
        });
    }
});

module.exports = function(themeService) {
    return new CompileService(themeService);
};