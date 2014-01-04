var klass = require('klass'),
    when = require('when'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore');
_.str = require('underscore.string');

var ThemeService = klass(function() {
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

module.exports = function() {
    return new ThemeService();
};