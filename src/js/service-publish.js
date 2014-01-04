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
        var tempId = _.uniqueId('topdf_'),
            tempHtmlFile = tempId + '.html',
            tempPdfFile = tempId + '.pdf';
        tempHtmlFile = path.join(tempDir, tempHtmlFile);
        var self = this;
        return self.save(tempHtmlFile, html)
            .then(function() {
                var deferred = when.defer();
                // Converts to PDF with child process running wkhtmltopdf
                var os = process.platform,
                    wkhtmltopdf = require('wkhtmltopdf');
                switch (os) {
                    case 'win32':
                        wkhtmltopdf.command = './bin/win32/wkhtmltopdf.exe';
                        break;
                    case 'linux':
                        wkhtmltopdf.command = (process.arch === 'x64') ? './bin/linux64/wkhtmltopdf-amd64' : './bin/linux32/wkhtmltopdf';
                        break;
                    case 'darwin':
                        wkhtmltopdf.command = './bin/macos/wkhtmltopdf';
                        break;
                    default:
                        break;
                }
                fs.chmodSync(wkhtmltopdf.command, '755');
                wkhtmltopdf('file:///' + tempHtmlFile, {
                    output: tempPdfFile,
                    footerCenter: '[page]/[topage]'
                }, function(code, signal) {
                    deferred.resolve();
                });
                return deferred.promise;
            })
            .then(function() {
                // Use this line because wkhtmltopdf doesn't support utf8 filename.
                // So it has to be exported to temp file and then be moved to target place by fs API.
                fs.renameSync(tempPdfFile, filename);
            })
            .ensure(function() {
                // Deletes unused temp file.
                fs.unlinkSync(tempHtmlFile);
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
    },
    getDefaultFilename: function(sourceFilename, extension) {
        var dir = path.dirname(sourceFilename),
            ext = path.extname(sourceFilename),
            base = path.basename(sourceFilename, ext),
            targetFilename = path.join(dir, base + extension);
        return targetFilename;
    }
});

module.exports = function() {
    return new PublishService();
};