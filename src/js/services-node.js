var klass = require('klass'),
    when = require('when'),
    pipeline = require('when/pipeline'),
    parallel = require('when/parallel'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');
_.str = require('underscore.string');

module.exports.FileAccessService = klass(function() {

}).methods({
    loadFile: function(filename) {
        var self = this,
            deferred = when.defer();
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
        var self = this,
            deferred = when.defer();
        fs.writeFile(filename, content, 'utf8', function(err) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(true);
            }
        });
        return deferred.promise;
    }
});

module.exports.ThemeService = klass(function() {
    this.themes = {
        'none': '',
        'book-en': fs.readFileSync('./public/css/theme-book-en.css', 'utf8'),
        'book-zh': fs.readFileSync('./public/css/theme-book-zh.css', 'utf8'),
        'article-en': fs.readFileSync('./public/css/theme-article-en.css', 'utf8'),
        'article-zh': fs.readFileSync('./public/css/theme-article-zh.css', 'utf8')
    };
}).methods({
    retrieveNames: function() {
        return ['article-en', 'article-zh', 'book-en', 'book-zh'];
    },
    retrieve: function(name) {
        return this.themes[name] || this.themes['article-en'];
    }
});