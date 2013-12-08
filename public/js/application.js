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

    mde.Editor = Class.extend({
        init: function(id, options) {
            options = $.extend({
                fontSize: 14,
                theme: "ace/theme/twilight",
                wrap: true
            }, options);
            this.$ace = $('#' + id);
            this._ace = ace.edit(id);
            this._ace.setFontSize(options.fontSize);
            this._ace.setShowPrintMargin(false);
            this._ace.setHighlightGutterLine(false);
            this._ace.setTheme(options.theme);
            this._ace.getSession().setMode("ace/mode/markdown");
            this._ace.getSession().setUseWrapMode(options.wrap);
        },
        resize: function(height) {
            this.$ace.height(height);
            this._ace.resize();
        }
    });
    mde.View = mde.EventEmitter.extend({
        init: function(options) {
            this._super();
            this.mainLayout = $("body").layout({
                applyDefaultStyles: false,
                defaults: {
                    spacing_open: 0,
                    spacing_closed: 0
                },
                center: {
                    onresize: function() {
                        this.centerPaneResized.fire(mainLayout.state.center.innerHeight);
                    }
                },
                east: {}
            });
            this.editor = new mde.Editor(options.editorId);
            this.register(['centerPaneResized']);
        },
        getEditor: function() {
            return this.editor;
        }
    });
    mde.Controller = Class.extend({
        init: function(view, model) {
            view.centerPaneResized().add(function(height) {
                view.editor().resize(height);
            });
        }
    });
    mde.Application = Class.extend({
        init: function() {},
        startup: function(options) {
            this.view = new mde.View(options);
            this.controller = new mde.View(this.view);
            this.settings = this.loadSettings();
        },
        loadSettings: function() {}
    });
})();
$(function() {
    var app = new mde.Application();
    app.startup({
        editorId: 'editor'
    });
});