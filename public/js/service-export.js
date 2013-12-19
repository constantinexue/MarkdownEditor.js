var klass = require('klass'),
    when = require('when'),
    fs = require('fs');

var ExportService = klass(function() {}).methods({
    toHTML: function(filename, htmlBody) {
        var self = this,
            deferred = when.defer();

        return self.getTemplate().then(function(template) {
            var html = template.replace(/\{\{body\}\}/g, htmlBody);
            fs.writeFile(filename, html, 'utf8', function(err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(html);
                }
            });
            return deferred.promise;
        });
    },
    toHtmlWithImages: function(filename, body) {

    },
    toPdf: function(filename, body) {

    },
    toImage: function(filename, body) {

    },
    getTemplate: function() {
        var self = this,
            deferred = when.defer();
        fs.readFile('./public/page-temp.html', 'utf8', function(err, template) {
            if (err) {
                deferred.reject(err);
            } else {
                fs.readFile('./public/css/style-default.css', 'utf8', function(err, css) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        template = template.replace(/\{\{style\}\}/g, css);
                        deferred.resolve(template);
                    }
                });
            }
        });
        return deferred.promise;
    }
});

module.exports = function() {
    return new ExportService();
};