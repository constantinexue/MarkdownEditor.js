var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    klass = require('klass');
_.mixin(_s.exports());

module.exports = klass(function(collection, subject) {
    this._collection = collection;
    this._subject = subject;
    this._content = null;
    this._dirPath = path.join(collection._path, this._subject);
    this._bodyPath = path.join(this._dirPath, '$body.md');
}).methods({
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
});