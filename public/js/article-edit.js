var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    marked = require('marked'),
    _ = require('underscore'),
    _s = require('underscore.string'),
    when = require('when'),
    gui = require('nw.gui');
_.mixin(_s.exports());
$(function() {
    var mainLayout = null,
        editor = null,
        $editor = $('#editor');
    // Makes editor fulfill with layout-center
    var adjustEditorSize = function(height) {
        $editor.height(mainLayout.state.center.innerHeight);
        $('iframe').attr('height', mainLayout.state.center.innerHeight + "px");
        editor.resize();
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
    var openFile = function(selectedFile) {
        var content = fs.readFileSync(selectedFile, 'utf8');
        var doc = editor.getSession().getDocument();
        doc.setValue(content);
        editor.gotoLine(0);
    };

    var initCommands = function() {
        var $openFileDialog = $("#openFileDialog"),
            $saveFileDialog = $("#saveFileDialog");
        var onDialogChanged = function($dialog, callback) {
            $dialog.change(function(evt) {
                var selectedFile = $(this).val();
                if (_.endsWith(selectedFile, '.md')) {
                    callback(selectedFile);
                }

                // The DOM of file must be reset for next choosing.
                $(this).val('');
            });
        };
        onDialogChanged($openFileDialog, openFile);
        onDialogChanged($saveFileDialog, function(selectedFile) {
            var doc = editor.getSession().getDocument();
            var content = doc.getValue();
            fs.writeFileSync(selectedFile, content);
        });
        $("#openButton").click(function() {
            $openFileDialog.trigger('click');
        });
        $('#saveButton').click(function() {
            $saveFileDialog.trigger('click');
        });
    };

    var initContainers = function() {
        var previewContainer = $("#container-preview"),
            htmlcodeContainer = $("#container-htmlcode"),
            markdownContainer = $('#editor'),
            markdownButton = $('#button-markdown'),
            previewButton = $('#button-preview'),
            htmlcodeButton = $('#button-html'),
            activeContainer = null,
            activeButton = null;
        previewContainer.hide();
        htmlcodeContainer.hide();
        var activateButton = function(button) {
            if (activeButton) {
                activeButton.parent().removeClass('active');
            }
            activeButton = button;
            activeButton.parent().addClass('active');
        };
        var activateContainer = function(container) {
            if (activeContainer) {
                activeContainer.hide();
            }
            activeContainer = container;
            activeContainer.show();
        };
        markdownButton.click(function() {
            activateButton($(this));
            activateContainer(markdownContainer);
            editor.focus();
        });
        previewButton.click(function() {
            activateButton($(this));
            var doc = editor.getSession().getDocument();
            var content = doc.getValue();
            md2html(content).then(function(html) {
                var previewPage = window.frames["iframe-preview"].document;
                previewPage.showPreview(html);
                activateContainer(previewContainer);
            });
        });
        htmlcodeButton.click(function() {
            activateButton($(this));
            var doc = editor.getSession().getDocument();
            var content = doc.getValue();
            md2html(content).then(function(html) {
                var htmlcodePage = window.frames["iframe-htmlcode"].document;
                htmlcodePage.showHtml(html);
                activateContainer(htmlcodeContainer);
            });
        });
        markdownButton.click();
    };

    var md2html = function(md) {
        var deferred = when.defer();
        marked(md, function(err, html) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(html);
            }
        });
        return deferred.promise;
    };

    initUILayout();
    initACE();
    initCommands();
    initContainers();
    adjustEditorSize();
    editor.focus();
    //openFile("D:\\projects\\github\\packled-papper.js\\data\\example1.md");
    var win = gui.Window.get();
    win.maximize();
});