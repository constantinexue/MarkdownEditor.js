(function() {
    "use strict";
    var path = require('path'),
        fs = require('fs');

    mde.Model = klass(function() {}).methods({
        loadFile: function(filename) {
            var deferred = when.defer();
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        },
        saveFile: function(filename, content) {
            var deferred = when.defer();
            fs.writeFile(filename, content, 'utf8', function(err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        },
        md2html: function(md) {
            var r = new marked.Renderer();
            r.code = function(code, lang) {
                console.log(code);
                console.log(lang);
            };
            r.blockquote = function(quote) {
                console.log(quote);
            };
            var deferred = when.defer();
            marked.parse(md, {
                renderer: r
            }, function(err, html) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(html);
                }
            });
            return deferred.promise;
        },
        loadSettings: function() {},
        saveSettings: function() {}
    });
})();