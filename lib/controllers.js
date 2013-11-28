var express = require('express'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	marked = require('marked'),
	_ = require('underscore'),
	_s = require('underscore.string');
_.mixin(_s.exports());

function fetchProjects() {
	var rootDir = path.join(__dirname, '../data'),
		projectDirs = fs.readdirSync(rootDir),
		projects = [];
	projectDirs.sort();
	projectDirs.forEach(function(projectDir) {
		var fullpath = path.join(rootDir, projectDir),
			stats = fs.statSync(fullpath);
		if (_.endsWith(projectDir, '.proj') && stats.isDirectory()) {
			var project = {
				name: _.rtrim(projectDir, '.proj'),
				path: path.join(rootDir, projectDir)
			};
			projects.push(project);
		} else {
			// Ignore other type files or folders.
		}
	});
	return projects;
};
module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			projects: fetchProjects()
		});
	});
};