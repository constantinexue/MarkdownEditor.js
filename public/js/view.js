(function() {
    "use strict";
    var gui = require('nw.gui'),
        win = gui.Window.get();

    mde.View = mde.EventEmitter.extend(function(options) {
        var self = this;

        win.on('close', function() {
            self.fire('windowClosing');
        });
        $(window).resize(function() {
            self.fire('windowResized');
        });
        self.fire('windowResized');

        // Navbar commands
        self.openDialog = $('#dialog-open'),
        self.saveDialog = $('#dialog-save'),
        self.newButton = $('#button-new'),
        self.openButton = $('#button-open'),
        self.saveButton = $('#button-save'),
        self.saveAsButton = $('#button-saveas');
        self.newButton.click(function() {
            self.fire('newButtonClicked');
        });
        self.openButton.click(function() {
            self.fire('openButtonClicked');
        });
        self.saveButton.click(function() {
            self.fire('saveButtonClicked');
        });
        self.saveAsButton.click(function() {
            self.fire('saveAsButtonClicked');
        });
        $('#button-export-html-plain').click(function() {
            self.fire('exportHtmlPlainButtonClick');
        });

        // Right panels operations
        self.viewPane = $('#page-view');
        self.tempPane = $('#page-temp');
        self.codePane = $('#ace-code');
        self.helpPane = $('#pane-help');
        self.arealeft = $('#area-left');
        var currentPaneButton = $('#button-showview');

        var highlightButton = function(button) {
            currentPaneButton.parent().removeClass('active');
            currentPaneButton = button;
            currentPaneButton.parent().addClass('active');
        };
        var setLeftPanesWidth = function(width) {
            self.arealeft.css('width', width);
            self.fire('windowResized');
        };
        $('#button-showview').click(function() {
            self.codePane.hide();
            self.helpPane.hide();
            self.viewPane.show();
            setLeftPanesWidth('50%');
            highlightButton($(this));
        });
        $('#button-showcode').click(function() {
            self.viewPane.hide();
            self.helpPane.hide();
            self.codePane.show();
            setLeftPanesWidth('50%');
            highlightButton($(this));
        });
        $('#button-showhelp').click(function() {
            self.viewPane.hide();
            self.codePane.hide();
            self.helpPane.show();
            setLeftPanesWidth('50%');
            highlightButton($(this));
        });
        $('#button-hide').click(function() {
            self.viewPane.hide();
            self.codePane.hide();
            self.helpPane.hide();
            setLeftPanesWidth('0');
            highlightButton($(this));
        });

        // ACE init
        options.editor = $.extend({
            fontSize: 16,
            theme: "ace/theme/twilight",
            wrap: true
        }, options.editor);
        self.aceEditContainer = $('#ace-edit');
        self.aceEdit = ace.edit(self.aceEditContainer[0]);
        self.aceEdit.setFontSize(options.editor.fontSize);
        self.aceEdit.setShowPrintMargin(false);
        self.aceEdit.setHighlightGutterLine(false);
        self.aceEdit.setTheme(options.editor.theme);
        self.aceEdit.getSession().setMode("ace/mode/markdown");
        self.aceEdit.getSession().setUseWrapMode(options.editor.wrap);
        self.aceEdit.on('change', function(evt) {
            self.fire('contentChanged');
        });
        self.aceEdit.focus();

        self.aceCodeContainer = $('#ace-code');
        self.aceCode = ace.edit(self.aceCodeContainer[0]);
        self.aceCode.setFontSize(options.editor.fontSize);
        self.aceCode.setShowPrintMargin(false);
        self.aceCode.setHighlightGutterLine(false);
        self.aceCode.setTheme(options.editor.theme);
        self.aceCode.getSession().setMode("ace/mode/html");
        self.aceCode.getSession().setUseWrapMode(options.editor.wrap);
        self.aceCode.setReadOnly(true);

        self.on('windowResized', function(evt) {
            var height = $(window).innerHeight() - $('.navbar').outerHeight();
            $('#container-workarea').css({
                height: height
            });
            self.aceEditContainer.height(height);
            self.aceEdit.resize();
            self.aceCodeContainer.height(height);
            self.aceCode.resize();
        });

        self.aceEdit.getSelection().on('changeCursor', function() {
            //self.syncCursor();
        });

        self.aceEdit.getSession().on('changeScrollTop', function(scroll) {
            //scroll = parseInt(scroll) || 0;
            self.syncScroll();
        });

        var eventKeyMap = {
            'mod+n': 'newButtonClicked',
            'mod+o': 'openButtonClicked',
            'mod+s': 'saveButtonClicked',
            'mod+shift+s': 'saveAsButtonClicked'
        };
        $.each(eventKeyMap, function(key, value) {
            Mousetrap.bindGlobal(key, function(e) {
                self.fire(value);
                return false;
            });
        });
        // https://groups.google.com/forum/#!topic/node-webkit/LIcbwBrF_CI
        $('a[target="_system"]').click(function(evt) {
            evt.preventDefault();
            var link = $(this).attr('href');
            gui.Shell.openExternal(link);
        });
        // http://stackoverflow.com/questions/15726411/how-to-use-bootstrap-select
        $('.selectpicker').selectpicker({
            //size: 4
        });
    }).methods({
        init: function() {
            var self = this;
            $('#button-showview').click();
            self.newButton.click();
            win.maximize();
            win.show();
        },
        getEditor: function() {
            return this.aceEdit;
        },
        setTitle: function(title) {
            win.title = title + '- MarkdownEditor.js';
        },
        showCode: function(html) {
            var self = this;
            // Send to view page
            var pageBody = self.viewPane.contents().find('body');
            pageBody.html(html);

            html = html_beautify(html, {
                indent_size: 4
            });
            self.aceCode.getSession().getDocument().setValue(html);
            self.syncScroll();
        },
        getCode: function(style) {
            var self = this,
                html = self.viewPane.contents().find('html'),
                head = html.find('head'),
                body = html.find('body'),
                tempHtml = self.tempPane.contents().find('html'),
                tempHead = tempHtml.find('head'),
                tempBody = tempHtml.find('body');
            tempBody.empty();
            body.clone().appendTo(tempBody);
            switch (style) {
                case 'styled':
                    // Reads css from style-default.css
                    var fs = require('fs'),
                        css = fs.readFileSync('./public/css/style-default.css', 'utf-8');
                    tempHead.append('<style>' + css + '</style>');
                    break;
                default:
                    break;
            }
            return tempHtml.html();
        },
        syncCursor: function() {
            var self = this;
            var editAll = self.aceEdit.getSession().getDocument().getLength(),
                codeAll = self.aceCode.getSession().getDocument().getLength(),
                editRow = self.aceEdit.getCursorPosition().row,
                codeRow = parseInt(editRow * codeAll / editAll);
            self.aceCode.scrollToLine(codeRow, true, true);
            self.aceCode.gotoLine(codeRow, 0, true);
        },
        syncScroll: function() {
            var self = this;
            // Sync preview
            var pageBody = self.viewPane.contents().find('body');
            var lh = self.aceEdit.getSession().getScreenLength() * self.aceEdit.renderer.lineHeight,
                ls = self.aceEdit.renderer.getScrollTop(),
                rh = pageBody.prop('scrollHeight'),
                rs = parseInt(ls * rh / lh);
            if (ls < lh) {
                pageBody.scrollTop(rs);
            }
            // Sync HTML code
            rh = self.aceCode.getSession().getScreenLength() * self.aceCode.renderer.lineHeight,
            rs = parseInt(ls * rh / lh);
            if (ls < lh) {
                self.aceCode.getSession().setScrollTop(rs);
            }
        },
        setContent: function(value) {
            var self = this;
            self.aceEdit.getSession().setValue(value);
            self.aceEdit.gotoLine(0);
            self.aceEdit.focus();
        },
        getContent: function() {
            var self = this,
                doc = self.aceEdit.getSession().getDocument();
            return doc.getValue();
        },
        selectFile: function(mode, type) {
            var self = this,
                dialog = null,
                deferred = when.defer();
            switch (mode) {
                case 'open':
                    dialog = self.openDialog;
                    break;
                case 'save':
                    dialog = self.saveDialog;
                    break;
                default:
                    return;
            }
            dialog.attr('accept', type);
            dialog.off('change');
            dialog.on('change', function(evt) {
                var selectedFile = $(this).val();
                deferred.resolve(selectedFile);
                $(this).val('');
            });
            dialog.trigger('click');

            return deferred.promise;
        },
        promptToSave: function() {
            var deferred = when.defer();
            // Prompt to save change first
            bootbox.dialog({
                message: "You have changed the content, do you want to save it first?",
                title: "Prompt to save",
                closeButton: false,
                buttons: {
                    save: {
                        label: "Save it now",
                        className: "btn-success",
                        callback: function() {
                            deferred.resolve(true);
                        }
                    },
                    notsave: {
                        label: "Discard change",
                        className: "btn-danger",
                        callback: function() {
                            deferred.resolve(false);
                        }
                    },
                    cancel: {
                        label: "Cancel",
                        callback: function() {
                            deferred.reject();
                        }
                    }
                }
            });
            return deferred.promise;
        },
        prompt: function(eventName) {
            var message = '';
            switch (eventName) {
                case 'saved':
                    message = 'File is saved';
                    break;
                case 'exported':
                    message = 'File is exported';
                    break;
                default:
                    break;
            }
            $.bootstrapGrowl(message, {
                ele: 'body', // which element to append to
                type: 'info', // (null, 'info', 'error', 'success')
                offset: {
                    from: 'bottom',
                    amount: 20
                }, // 'top', or 'bottom'
                align: 'center', // ('left', 'right', or 'center')
                width: 300, // (integer, or 'auto')
                delay: 1000,
                allow_dismiss: true,
                stackup_spacing: 10 // spacing between consecutively stacked growls.
            });
        },
        close: function() {
            this.fire('windowClosed');
            win.close(true);
        }
    });
})();