var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string');
_.mixin(_s.exports());

var ROOT_PATH = path.join(__dirname, '../data');

function Collection(name) {
    if (_.isString(name)) {
        this._name = name;
        this._path = path.join(ROOT_PATH, this._name);
    } else {
        this._name = null;
        this._path = null;
    }
}
Collection.prototype = {
    name: function(value) {
        var self = this;
        if (_.isString(value)) {
            // Setter
            self._name = value;
            // Renames directory
            var oldPath = self._path,
                newPath = path.join(ROOT_PATH, self._name);
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
};

function Article(collection, subject) {
    this._collection = collection;
    this._subject = subject;
    this._content = null;
    this._dirPath = path.join(collection._path, this._subject);
    this._bodyPath = path.join(this._dirPath, '$body.md');
}
Article.prototype = {
    subject: function() {
        return this._subject;
    },
    content: function() {
        if (_.isNull(this._content)) {
            this._content = fs.readFileSync(this._bodyPath, 'utf8');
        }
        return this._content;
    },
    create: function(content) {
        this._content = content;
        fs.mkdirSync(this._dirPath);
        fs.writeFileSync(this._bodyPath, content);
    },
    update: function(content) {
        this._content = content;
        fs.writeFileSync(this._bodyPath, content);
    },
    delete: function() {
        this._content = null;
        fse.removeSync(this._dirPath);
        var document = {};
        var collection
    }
};

module.exports = {
    collection: function(name) {
        var collection = new Collection(name);
        return collection;
    },
    collections: function() {
        var dirs = fs.readdirSync(ROOT_PATH),
            collections = [];
        dirs.sort();
        dirs.forEach(function(dir) {
            var fullpath = path.join(ROOT_PATH, dir),
                stats = fs.statSync(fullpath);
            if (stats.isDirectory()) {
                collections.push({
                    name: dir
                });
            }
        });
        return collections;
    }
};