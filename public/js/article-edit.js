var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string');
_.mixin(_s.exports());
$(function() {
    var mainLayout = null,
        editor = null;
    // Makes editor fulfill with layout-center
    var adjustEditorSize = function(height) {
        $('#editor').css({
            height: mainLayout.state.center.innerHeight - 20
        });
        editor.resize(true);
    };
    var initUILayout = function() {
        mainLayout = $("body").layout({
            applyDefaultStyles: false,
            defaults: {
                spacing_open: 0,
                spacing_closed: 0
            },
            center: {
                onresize: adjustEditorSize
            },
            east: {

            }
        });
    };

    var initACE = function() {
        editor = ace.edit("editor");
        editor.setFontSize(16);
        editor.setShowPrintMargin(false);
        editor.setHighlightGutterLine(false);
        editor.setTheme("ace/theme/twilight");
        editor.getSession().setMode("ace/mode/markdown");
        editor.getSession().setUseWrapMode(true);
        // console.log(editor.renderer)
        // editor.renderer.setScrollMargin(5, 100, 0, 10);

        var expandEditorHeight = function() {

            // http://stackoverflow.com/questions/11584061/
            var newHeight =
                editor.getSession().getScreenLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();

            $('#editor').height(newHeight.toString() + "px");
            $('#editor-section').height(newHeight.toString() + "px");

            // This call is required for the editor to fix all of
            // its inner structure for adapting to a change in size
            editor.resize();
        };

        // Set initial size to match initial content
        //expandEditorHeight();

        // Whenever a change happens inside the ACE editor, update
        // the size again
        //editor.getSession().on('change', expandEditorHeight);
    };

    initUILayout();
    initACE();
    adjustEditorSize();

    $("#openButton").click(function() {
        var chooser = $("#openFileDialog");
        chooser.change(function(evt) {
            var selectedFile = $(this).val();
            if (_.endsWith(selectedFile, '.md')) {
                var content = fs.readFileSync(selectedFile, 'utf8');
                // editor.selectAll();
                // editor.insert(contentMd);
                var doc = editor.getSession().getDocument();
                doc.setValue(content);
                editor.gotoLine(0);
            }
        });

        chooser.trigger('click');
    });

    $('#saveButton').click(function() {
        var chooser = $("#saveFileDialog");
        chooser.change(function(evt) {
            var selectedFile = $(this).val();
            if (_.endsWith(selectedFile, '.md')) {
                var doc = editor.getSession().getDocument();
                var content = doc.getValue();
                fs.writeFileSync(selectedFile, content);
            }
        });

        chooser.trigger('click');
    });
});