var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    klass = require('klass'),
    Article = require('./article');
_.mixin(_s.exports());

module.exports = klass(function(name, root) {
    if (_.isString(name)) {
        this._name = name;
        this._root = root;
        this._path = path.join(this._root, this._name);
    } else {
        this._name = null;
        this._path = null;
    }
}).methods({
    name: function(value) {
        var self = this;
        if (_.isString(value)) {
            // Setter
            self._name = value;
            // Renames directory
            var oldPath = self._path,
                newPath = path.join(self._root, self._name);
            fs.renameSync(oldPath, newPath);
            self._path = newPath;
            return self;
        } else {
            // Getter
            return self._name;
        }
    },
    create: function() {
        var self = this;
        if (!fs.existsSync(self._path)) {
            // Mkdir fs directory
            fs.mkdir(self._path);
        } else {}
        return this;
    },
    delete: function() {
        var self = this;
        if (fs.existsSync(self._path)) {
            fs.rmdirSync(self._path);
        } else {}
        return this;
    },
    article: function(subject) {
        return new Article(this, subject);
    },
    articles: function() {
        var self = this;
        var dirs = fs.readdirSync(self._path),
            articles = [];
        dirs.sort();
        dirs.forEach(function(dir) {
            var fullpath = path.join(self._path, dir),
                stats = fs.statSync(fullpath);
            if (stats.isDirectory()) {
                articles.push({
                    subject: dir
                });
            }
        });
        return articles;
    }
});