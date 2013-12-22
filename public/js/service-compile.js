// "use strict";
var klass = require('klass'),
    when = require('when'),
    parallel = require('when/parallel'),
    fs = require('fs'),
    path = require('path'),
    marked = require('marked'),
    hljs = require('highlight.js'),
    http = require('http-get'),
    _ = require('underscore');
_.str = require('underscore.string');

var template = fs.readFileSync('./public/page-temp.html', 'utf8'),
    themes = {
        'none': '',
        'default': fs.readFileSync('./public/css/style-default.css', 'utf8')
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

function EmbeddedImage(old) {
    var self = {};
    self.old = old;
    self.imageMappings = {};
    this.compile = function(href, title, text) {
        var html, base64, id = _.uniqueId('image_');
        self.imageMappings[id] = href;
        html = self.old('{{' + id + '}}', title, text);
        return html;
    };
    this.replace = function(html) {
        var tasks = [];
        _.pairs(self.imageMappings).forEach(function(mapping) {
            var id = mapping[0],
                src = mapping[1];
            tasks.push(function() {
                var imageDeferred = when.defer();
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

var CompileService = klass(function() {}).methods({
    compile: function(text, options, theme) {
        var self = {};
        options = _.extend({
            headingNumber: true,
            highlightCode: true,
            base64Image: false
        }, options);
        var r = new marked.Renderer();
        if (options.highlightCode) {
            r.code = highlightCode;
        }
        if (options.headingNumber) {
            r.heading = new HeadingNumber().compile;
        }
        if (options.base64Image) {
            self.embeddedImage = new EmbeddedImage(r.image);
            r.image = self.embeddedImage.compile;
        }
        return markdown(text, {
            renderer: r
        }).then(function(html) {
            if (options.base64Image) {
                return self.embeddedImage.replace(html);
            } else {
                return when.resolve(html);
            }
        }).then(function(html) {
            if (!_.isUndefined(theme)) {
                var style = themes[theme],
                    output = template.replace('{{style}}', style);
                output = output.replace('{{body}}', html);
                return when.resolve(output);;
            } else {
                return when.resolve(html);;
            }
        });
    }
});

module.exports = function() {
    return new CompileService();
};