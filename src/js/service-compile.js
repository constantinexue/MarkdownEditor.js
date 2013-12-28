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

var template = fs.readFileSync('./public/page-temp.html', 'utf8'),
    themes = {
        'none': '',
        'article-cn': fs.readFileSync('./public/css/style-default.css', 'utf8')
    };

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

function HeadingNumber() {
    var self = {};
    self.headingNumbers = [null, 0, 0, 0, 0, 0, 0];
    this.compile = function(text, level) {
        var i = 0,
            number = '',
            html = '';
        for (i = level; i > 0; i--) {
            if (number === '') {
                self.headingNumbers[i]++;
            }
            number = self.headingNumbers[i] + '.' + number;
        }
        // Reset child numbers
        for (i = level + 1; i < 7; i++) {
            self.headingNumbers[i] = 0;
        }
        html = _.str.sprintf('<h%1$d>%3$s&emsp;%2$s</h%1$d>', level, text, number);
        return html;
    };
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

var CompileService = klass(function() {
    this.options = {
        theme: 'article-cn',
        headingNumber: true,
        highlightCode: true,
        embedImage: false
    };
}).methods({
    getOptions: function() {
        return this.options;
    },
    setOptions: function(value) {
        this.options = value;
        return this;
    },
    compile: function(currentFile, text) {
        var fileDir = path.dirname(currentFile);
        var self = this;
        var r = new marked.Renderer();
        if (self.options.highlightCode) {
            //r.code = highlightCode;
        }
        if (self.options.headingNumber) {
            r.heading = new HeadingNumber().compile;
        }
        var imagePipeline = null;
        if (self.options.embedImage) {
            imagePipeline = new ImagePipeline([new ImagePathStage(), new ImageEmbedStage()], fileDir, r.image);
        } else {
            imagePipeline = new ImagePipeline([new ImagePathStage()], fileDir, r.image);
        }
        r.image = imagePipeline.execute;
        return markdown(text, {
            breaks: true,
            renderer: r
        }).then(function(body) {
            return imagePipeline.deal(body);
        }).then(function(body) {
            var style = themes[self.options.theme],
                html = template.replace('{{style}}', style).replace('{{body}}', body);
            return when.resolve(html);;
        });
    }
});

module.exports = function() {
    return new CompileService();
};