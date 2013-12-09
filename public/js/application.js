(function() {
    "use strict";
    var express = require('express'),
        http = require('http'),
        path = require('path'),
        fs = require('fs'),
        marked = require('marked'),
        _ = require('underscore'),
        _s = require('underscore.string'),
        when = require('when');
    _.mixin(_s.exports());

    var initEventsMap = function(eventNames) {
        var map = {};
        $.each(eventNames, function(index, item) {
            map[item] = $.Callbacks();
        });
        return map;
    };
    mde.EventEmitter = Class.extend({
        init: function() {},
        register: function(events) {
            this._events = initEventsMap(events);
        },
        on: function(name, callback) {
            this._events[name].add(callback);
            return this;
        },
        fire: function(name, param) {
            this._events[name].fire(param);
            return this;
        }
    });
    mde.Model = Class.extend({
        init: function() {

        },
        loadFile: function(filename) {
            var deferred = when.defer();
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(html);
                }
            });
            return deferred.promise;
        },
        saveFile: function(filename, content) {
            var deferred = when.defer();
            fs.writeFile(filename, content, 'utf8', function(err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        },
        loadSettings: function() {},
        saveSettings: function() {}
    });
    mde.Navbar = mde.EventEmitter.extend({
        init: function() {
            var self = this;
            self._super();
            self.openDialog = $('#dialog-open'),
            self.saveDialog = $('#dialog-save'),
            self.openButton = $('#button-open'),
            self.saveButton = $('#button-save'),
            self.saveAsButton = $('#button-saveas');
            self.register(['openFileSelected', 'saveFileSelected']);
            var onDialogChanged = function(dialog, callback) {
                dialog.change(function(evt) {
                    var selectedFile = $(this).val();
                    if (_.endsWith(selectedFile, '.md')) {
                        callback(selectedFile);
                    }

                    // The DOM of file must be reset for next choosing.
                    $(this).val('');
                });
            };
            onDialogChanged(self.openDialog, function(selectedFile) {
                self.fire('openFileSelected', selectedFile);
            });
            onDialogChanged(self.saveDialog, function(selectedFile) {
                self.fire('saveFileSelected', selectedFile);
            });
            self.openButton.click(function() {
                self.openDialog.trigger('click');
            });
            self.saveButton.click(function() {
                self.saveDialog.trigger('click');
            });
        }
    });
    mde.Editor = Class.extend({
        init: function(id, options) {
            var self = this;
            options = $.extend({
                fontSize: 14,
                theme: "ace/theme/twilight",
                wrap: true
            }, options);
            self.aceContainer = $('#' + id);
            self.ace = ace.edit(id);
            self.ace.setFontSize(options.fontSize);
            self.ace.setShowPrintMargin(false);
            self.ace.setHighlightGutterLine(false);
            self.ace.setTheme(options.theme);
            self.ace.getSession().setMode("ace/mode/markdown");
            self.ace.getSession().setUseWrapMode(options.wrap);
        },
        resize: function(height) {
            var self = this;
            self.aceContainer.height(height);
            self.ace.resize();
        }
    });
    mde.View = mde.EventEmitter.extend({
        init: function(options) {
            var self = this;
            self._super();
            self.mainLayout = $("body").layout({
                applyDefaultStyles: false,
                defaults: {
                    spacing_open: 0,
                    spacing_closed: 0
                },
                center: {
                    onresize: function() {
                        // Resize editor and iframes
                        var height = mainLayout.state.center.innerHeight;
                        self.editor.resize(height);
                        $('iframe').attr('height', height + "px");
                    }
                },
                east: {}
            });
            self.editor = new mde.Editor(options.editorId);
            self.register(['centerPaneResized']);
        },
        getEditor: function() {
            return this.editor;
        }
    });
    mde.Controller = Class.extend({
        init: function(view, model) {
            view.on('openButtonClicked', function() {

            }).on('saveButtonClicked', function() {
                view.selectFileToSave()
                    .then(function(filename) {
                        var content = view.getContent();
                        model.saveFile(filename, content);
                    });
            });
        }
    });
    mde.Application = Class.extend({
        init: function() {},
        startup: function(options) {
            this.view = new mde.View(options);
            this.controller = new mde.View(this.view);
        }
    });
})();
$(function() {
    var app = new mde.Application();
    app.startup({
        editorId: 'editor'
    });
});