(function() {
    "use strict";

    var klass = klass || require('klass'),
        when = when || require('when'),
        marked = marked || require('marked'),
        _ = _;

        if (!_){
            _ = require('underscore');
            _.str = require('underscore.string');
        }


    var Converter = klass(function() {
        var self = this;
        self.headingNumbers = [null, 0, 0, 0, 0, 0, 0];
        var r = new marked.Renderer();
        r.code = function(code, lang) {
            var html = '';
            if (!lang) {
                html = '<pre><code>' + escape(code, true) + '\n</code></pre>';
            } else {
                if (lang === 'js') {
                    lang = 'javascript';
                }
                html = hljs.highlight(lang, code).value;
                html = '<pre><code class="' + 'lang-' + lang + '">' + html + '\n</code></pre>\n'
            }
            return html;
        };
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
            html = _.str.sprintf('<h%1$d>%3$s\t%2$s</h%1$d>', level, text, number);
            return html;
        };
        self.options = {
            renderer: r
        };
    }).methods({
        convert: function(md) {
            var self = this;
            var deferred = when.defer();
            marked.parse(md, self.options, function(err, html) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(html);
                }
            });
            return deferred.promise;
        }
    });

    if (typeof exports === 'object') {
        module.exports = Converter;
    } else {
        window.mde.Converter = Converter;
    }

})();