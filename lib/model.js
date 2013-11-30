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
	}
};

function Article(project, subject) {
	this._project = project;
	this._subject = subject;
	this._dirPath = path.join(project._path, this._subject);
	this._txtPath = path.join(this._dirPath, this._subject + '.md');
	this._content = null;
}
Article.prototype = {
	subject: function() {
		return this._subject;
	},
	content: function() {
		if (_.isNull(this._content)) {
			this._content = fs.readFileSync(this._txtPath);
		}
		return this._content;
	},
	create: function(content) {
		this._content = content;
		fs.mkdirSync(this._dirPath);
		fs.writeFileSync(this._txtPath, content);
	},
	update: function(content) {
		this._content = content;
		fs.writeFileSync(this._txtPath, content);
	},
	delete: function() {
		fse.removeSync(this._dirPath);
	}
};

module.exports = {
	project: function(name) {
		var project = new Project(name);
		return project;
	},
	fetchProjects: function() {

	}
};