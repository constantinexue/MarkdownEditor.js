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
        exportToHtml: function(filename, html) {
            var self = this,
                deferred = when.defer();
            html = $.parseHTML(html);
            html = html.find('head');
            html.each(function(index){
                console.log($(this));
            });
            return deferred.promise;
        },
        md2html: function(md) {
            var r = new marked.Renderer();
            r.code = function(code, lang) {
                return code;
            };
            r.blockquote = function(quote) {
                return quote;
            };
            var options = {
                renderer: r
            };
            var deferred = when.defer();
            marked.parse(md, function(err, html) {
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