var klass = require('klass'),
    when = require('when'),
    pipeline = require('when/pipeline'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');
_.str = require('underscore.string');

var ExportService = klass(function() {}).methods({
    toHTML: function(filename, htmlBody, mode) {
        var self = this,
            deferred = when.defer(),
            html = '';

        mode = mode || 'plain';

        self.getTemplate().then(function(template) {
            html = template.replace(/\{\{body\}\}/g, htmlBody);
            return deferred.resolve(html);
        }).then(function(html) {
            if (mode === 'styled') {
                return self.getStyle();
            } else {
                return deferred.resolve('');
            }
        }).then(function(style) {
            html = html.replace(/\{\{style\}\}/g, style);
            return deferred.resolve(html);
        }).then(function(html) {
            return self.save(filename, html);
        });
        return deferred.promise;
    },
    toPDF: function(filename, htmlBody, mode) {
        // Generates a temp HTML
        var tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        var tempFile = _.uniqueId('topdf_') + '.html';
        tempFile = path.join(tempDir, tempFile);
        var self = this,
            deferred = when.defer();
        return self.toHTML(tempFile, htmlBody, mode).then(function() {
            return self.pdfify(tempFile, filename);
        }).ensure(function() {
            // Deletes unused temp file.
            fs.unlinkSync(tempFile);
        });
    },
    pdfify: function(tempFile, filename) {
        var self = this,
            deferred = when.defer();
        // Converts to PDF with child process running wkhtmltopdf
        var wkhtmltopdf = require('./wkhtmltopdf');
        wkhtmltopdf.command = './bin/wkhtmltopdf';
        wkhtmltopdf('file:///' + tempFile, {
            output: filename
        }, function(code, signal) {
            deferred.resolve();
        });
        return deferred.promise;
    },
    toImage: function(filename, body) {

    },
    save: function(filename, content) {
        var self = this,
            deferred = when.defer();
        fs.writeFile(filename, content, 'utf8', function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(content);
            }
        });

        return deferred.promise;
    },
    getTemplate: function() {
        var self = this,
            deferred = when.defer();
        fs.readFile('./public/page-temp.html', 'utf8', function(err, template) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(template);
            }
        });
        return deferred.promise;
    },
    getStyle: function() {
        var self = this,
            deferred = when.defer();
        fs.readFile('./public/css/style-default.css', 'utf8', function(err, css) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(css);
            }
        });
        return deferred.promise;
    }
});

module.exports = function() {
    return new ExportService();
};