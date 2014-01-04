(function() {
    "use strict";
    var path = require('path'),
        fs = require('fs'),
        compileService = require('./js/service-compile')();

    mde.Model = mde.EventEmitter.extend(function() {
    }).methods({
        loadFile: function(filename) {
            var self = this,
                deferred = when.defer();
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    self.historiesService.updateHistories(filename);
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
                    self.historiesService.updateHistories(filename);
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        },
        md2html: function(md) {
            // var converter = new Converter();
            // return converter.convert(md);
            return compileService.compile(md);
        }
    });
})();