var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    fse = require('fs-extra'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    Collection = require('./models/collection');
_.mixin(_s.exports());

var ROOT_PATH = path.join(__dirname, '../data');

module.exports = {
    collection: function(name) {
        var collection = new Collection(name, ROOT_PATH);
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