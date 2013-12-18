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
            var converter = new mde.Converter();
            return converter.convert(md);
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