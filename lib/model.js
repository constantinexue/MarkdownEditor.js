var express = require('express'),
	http = require('http'),
	path = require('path'),
	fs = require('fs'),
	marked = require('marked'),
	_ = require('underscore'),
	_s = require('underscore.string');
_.mixin(_s.exports());

var ROOT_PATH = path.join(__dirname, '../data');

function Project(name) {
	if (_.isString(name)) {
		this._name = name;
		this._path = path.join(ROOT_PATH, this._name);
	} else {
		this._name = null;
		this._path = null;
	}
}
Project.prototype = {
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
	create: function(name) {
		var self = this;
		if (_.isString(name)) {
			// Mkdir fs directory
			self._name = name;
			self._path = path.join(ROOT_PATH, self._name);
			fs.mkdir(self._path);
			return this;
		} else {
			throw new Error();
		}
	},
	delete: function() {
		var self = this;
		if (fs.existsSync(self._path)) {
			console.log(self._path);
			fs.rmdirSync(self._path);
			self._name = null;
			self._path = null;
		} else {}
	}
};

module.exports = {
	createProject: function(name) {
		var project = new Project();
		project.create(name);
		return project;
	},
	deleteProject: function(name) {
		var project = new Project(name);
		project.delete();
	},
	createArticle: function(subject, content) {

	},
	createAlbum: function(subject, content) {

	},
	delete: function(subject) {

	},
};