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
	// app.get('/', function(req, res) {
	// 	res.render('index', {
	// 		projects: allProjects
	// 	});
	// });
	// app.get('/projects/:projectName', function(req, res) {
	// 	var projectName = req.params.projectName,
	// 		project = _.find(allProjects, function(item) {
	// 			return item.name === projectName;
	// 		});
	// });
	// Gets all the subjects in this project
	app.get('/api/:projectName', function(req, res) {});
	// Gets all the subjects in this project
	app.post('/api/:projectName', function(req, res) {
		var project = model.createProject(req.params.projectName);

		res.json({
			name: project.name()
		});
	});
	app.delete('/api/:projectName', function(req, res) {
		var project = model.deleteProject(req.params.projectName);

		res.json({});
	});
	// Gets the a markdown content
	app.get('/api/:projectName/:subject.md', function(req, res) {});
	// Creates a markdown document
	app.post('/api/:projectName/:subject.md', function(req, res) {});
	// Updates a markdown content
	app.put('/api/:projectName/:subject.md', function(req, res) {});
	// Deletes a markdown document
	app.delete('/api/:projectName/:subject.md', function(req, res) {});
};