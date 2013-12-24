(function() {
    "use strict";

    var klass = klass || require('klass'),
        when = when || require('when'),
        parallel = when.parallel || require('when/parallel'),
        marked = marked || require('marked'),
        request = require('request'),
        hljs = hljs || require('highlight.js'),
        _ = _;

    if (!_) {
        _ = require('underscore');
        _.str = require('underscore.string');
    }

    var Converter = klass(function() {}).methods({
        convert: function(md, settings) {
            var self = this;

            settings = _.extend({
                headingNumber: true,
                highlightCode: true,
                base64Image: false
            }, settings);
            var self = this;
            self.headingNumbers = [null, 0, 0, 0, 0, 0, 0];
            self.imageMappings = {};
            var r = new marked.Renderer();
            if (settings.highlightCode) {
                r.code = function(code, lang) {
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
                };
            }
            if (settings.headingNumber) {
                r.heading = function(text, level) {
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
            if (settings.base64Image) {
                var oldImageFunc = r.image;
                r.image = function(href, title, text) {
                    var html, base64, id = _.uniqueId('image_');
                    self.imageMappings[id] = href;
                    html = oldImageFunc('{{' + id + '}}', title, text);
                    return html;
                };
            }
            var options = {
                renderer: r
            }
            var deferred = when.defer();
            marked.parse(md, options, function(err, html) {
                if (err) {
                    deferred.reject(err);
                } else {
                    var http = require('http-get');
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
                    parallel(tasks).then(function() {
                        _.pairs(self.imageMappings).forEach(function(mapping) {
                            var id = '{{' + mapping[0] + '}}',
                                src = 'data:image/png;base64,' + mapping[1];
                            html = html.replace(id, src);
                        });
                        deferred.resolve(html);
                    });
                }
            });
            return deferred.promise;
        }
    });

    if (typeof exports === 'object') {
        module.exports = Converter;
    } else {
         = Converter;
    }

})(typeof exports === 'undefined'? window.mde.Converter = {}: exports);