var klass = require('klass'),
    when = require('when'),
    pipeline = require('when/pipeline'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');
_.str = require('underscore.string');

var PublishService = klass(function() {}).methods({
    publish: function(filename, html) {
        var self = this;
        switch (path.extname(filename)) {
            case '.html':
                return self.save(filename, html);
            case '.pdf':
                return self.toPDF(filename, html);
            default:
                break;
        }
    },
    toPDF: function(filename, html, mode) {
        // Generates a temp HTML
        var tempDir = path.join(__dirname, '../../', 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        var tempFile = _.uniqueId('topdf_') + '.html';
        tempFile = path.join(tempDir, tempFile);
        var self = this;
        return self.save(tempFile, html).then(function() {
            var deferred = when.defer();
            // Converts to PDF with child process running wkhtmltopdf
            var os = require('os'),
                wkhtmltopdf = require('wkhtmltopdf');
            switch (os.platform()) {
                case 'win32':
                    wkhtmltopdf.command = './bin/win32/wkhtmltopdf.exe';
                    break;
                case 'linux':
                    wkhtmltopdf.command = (os.arch() === 'x64') ? './bin/linux64/wkhtmltopdf-amd64' : './bin/linux32/wkhtmltopdf';
                    break;
                case 'darwin':
                    wkhtmltopdf.command = './bin/macos/wkhtmltopdf';
                    break;
                default:
                    break;
            }
            fs.chmodSync(wkhtmltopdf.command, '755');
            wkhtmltopdf('file:///' + tempFile, {
                output: filename,
                footerCenter: '[page]/[topage]'
            }, function(code, signal) {
                deferred.resolve();
            });
            return deferred.promise;
        }).ensure(function() {
            // Deletes unused temp file.
            fs.unlinkSync(tempFile);
        });
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
    }
});

module.exports = function() {
    return new PublishService();
};