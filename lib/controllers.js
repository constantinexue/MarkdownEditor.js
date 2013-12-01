var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    model = require('./model');
_.mixin(_s.exports());

var supportedTypes = ['.js', '.java', '.json', '.xml'],
    allProjects = fetchProjects();

function fetchFile(fullpath) {
    var stats = fs.statSync(fullpath),
        ext = path.extname(fullpath);
    if (_.contains(supportedTypes, ext)) {
        var file = {
            name: path.basename(fullpath),
            type: ext
        };
        return file;
    } else {
        return null;
    }
};

function fetchProject(fullpath) {
    var stats = fs.statSync(fullpath),
        ext = path.extname(fullpath);
    if (stats.isDirectory()) {
        var project = {
            name: path.basename(fullpath),
            path: fullpath,
            files: []
        };
        // Get the files in a project
        var fileDirs = fs.readdirSync(fullpath);
        fileDirs.sort();

        fileDirs.forEach(function(fileDir) {
            var file = fetchFile(path.join(fullpath, fileDir));
            if (file) {
                file.path = path.join(project.name, file.name);
                project.files.push(file);
            }
        });

        return project;
    } else {
        // Ignore other type files or folders.
        return null;
    }
};

function fetchProjects() {
    var rootDir = path.join(__dirname, '../data'),
        projectDirs = fs.readdirSync(rootDir),
        projects = [];
    projectDirs.sort();
    projectDirs.forEach(function(projectDir) {
        var fullpath = path.join(rootDir, projectDir),
            project = fetchProject(fullpath);
        if (project) {
            projects.push(project);
        }
    });
    return projects;
};
module.exports = function(app) {
    app.get('/', function(req, res) {
        var collections = model.collections();
        console.log(collections);
        res.render('index', {
            collections: collections
        });
    });
    app.get('/view/:collectionName', function(req, res) {
        var collection = model.collection(req.params.collectionName),
            articles = collection.articles();
        res.render('collection', {
            collection: collection,
            articles: articles
        });
    });
    app.get('/view/:collectionName/:articleSubject', function(req, res) {
        var collection = model.collection(req.params.collectionName),
            article = collection.article(req.params.articleSubject),
            content = article.content();
        marked(content, function(err, html) {
            if (err) throw err;
            res.render('article', {
                collection: collection,
                article: article,
                content: html
            });
        });
    });
    // Gets all the subjects in this project
    app.get('/api/:collectionName', function(req, res) {});
    // Gets all the subjects in this project
    app.post('/api/:collectionName', function(req, res) {
        var collection = model.collection(req.params.collectionName);
        collection.create();
        res.json({
            name: collection.name()
        });
    });
    app.delete('/api/:collectionName', function(req, res) {
        var collection = model.collection(req.params.collectionName);
        collection.delete();
        res.json({});
    });
    // Gets the a markdown content
    app.get('/api/:collectionName/:articleSubject', function(req, res) {
        var collection = model.collection(req.params.collectionName),
            article = collection.article(req.params.articleSubject);
        res.json({
            subject: article.subject(),
            content: article.content()
        });
    });
    // Creates a markdown document
    app.post('/api/:collectionName/:articleSubject', function(req, res) {
        var collection = model.collection(req.params.collectionName),
            article = collection.article(req.params.articleSubject);
        article.create(req.body.content);
        res.json({
            subject: article.subject(),
            content: article.content()
        });
    });
    // Updates a markdown content
    app.put('/api/:collectionName/:articleSubject', function(req, res) {
        var collection = model.collection(req.params.collectionName),
            article = collection.article(req.params.articleSubject);
        article.update(req.body.content);
        res.json({
            subject: article.subject(),
            content: article.content()
        });
    });
    // Deletes a markdown document
    app.delete('/api/:collectionName/:articleSubject', function(req, res) {
        var collection = model.collection(req.params.collectionName),
            article = collection.article(req.params.articleSubject);
        article.delete();
        res.json({});
    });
};