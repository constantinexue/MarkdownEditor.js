```js
(function() {
    "use strict";
    var path = require('path'),
        fs = require('fs'),
        Parser = require('parse5').Parser;

    mde.Model = mde.EventEmitter.extend(function() {}).methods({
        getHistories: function() {
            var jsonString = localStorage.getItem('histories');
            try {
                var histories = JSON.parse(jsonString);
                return (_.isArray(histories)) ? histories : [];
            } catch (err) {
                localStorage.removeItem('histories');
                return [];
            }
        },
        setHistories: function(value) {
            var jsonString = JSON.stringify(value);
            localStorage.setItem('histories', jsonString);
            return this;
        },
        loadFile: function(filename) {
            var self = this,
                deferred = when.defer();
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    self.updateHistories(filename);
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        },
        saveFile: function(filename, content) {
            var self = this,
                deferred = when.defer();
            fs.writeFile(filename, content, 'utf8', function(err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    self.updateHistories(filename);
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        },
        exportToHtml: function(filename, html) {
            var self = this,
                deferred = when.defer();

            console.log(html);
            return deferred.promise;
        },
        exportToPdf: function(filename, html) {
            // Save html to a temp file
            // Invoke child process of phantomjs to render the temp file to pdf
            // e.g: https://github.com/benweet/html2pdf.it/blob/master/lib/webservices/pdf.js
            //      https://github.com/ariya/phantomjs/blob/master/examples/rasterize.js
        },
        md2html: function(md) {
            // var parser = new Parser();
            // var document = parser.parse('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
            // console.log(document);
            var headingNumbers = [null, 0, 0, 0, 0, 0, 0];
            var r = new marked.Renderer();
            var old = r.code;
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
                        headingNumbers[i]++;
                    }
                    number = headingNumbers[i] + '.' + number;
                }
                html = _.str.sprintf('<h%1$d>%3$s\t%2$s</h%1$d>', level, text, number);
                return html;
            };
            var options = {
                renderer: r
            };
            var deferred = when.defer();
            marked.parse(md, options, function(err, html) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(html);
                }
            });
            return deferred.promise;
        },
        loadSettings: function() {},
        saveSettings: function() {},
        updateHistories: function(newlyFile) {
            var histories = this.getHistories(),
                index = -1;
            if (_.isArray(histories)) {
                index = _.indexOf(histories, newlyFile);
                if (index !== -1) {
                    // Remove it firstly
                    histories = _.without(histories, newlyFile);
                }
            } else {
                histories = [];
            }
            // Add to the head
            histories.unshift(newlyFile);
            // Keep top 10
            histories = histories.slice(0, 10);
            this.setHistories(histories);
            this.fire('historiesChanged', histories);

            return when.resolve(histories);
        }
    });
})();
```