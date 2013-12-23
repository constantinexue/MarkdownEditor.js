(function() {
    "use strict";
    var gui = require('nw.gui'),
        win = gui.Window.get();

    mde.View = mde.EventEmitter.extend(function() {
        var self = this;

        win.on('close', function() {
            self.fire('windowClosing');
        });
        $(window).resize(function() {
            self.fire('windowResized');
        });

        // Navbar commands
        self.openDialog = $('#dialog-open');
        self.saveDialog = $('#dialog-save');
        // ACE init
        self.aceEditContainer = $('#ace-edit');
        self.aceEdit = ace.edit(self.aceEditContainer[0]);
        self.aceEdit.setShowPrintMargin(false);
        self.aceEdit.setHighlightGutterLine(false);
        self.aceEdit.getSession().setMode("ace/mode/markdown");
        self.aceEdit.getSession().setUseWrapMode(true);
        self.aceEdit.on('change', function(evt) {
            self.fire('contentChanged');
        });
        self.aceEdit.focus();

        self.on('windowResized', function(evt) {
            var height = $(window).innerHeight() - $('.navbar').outerHeight();
            $('#container-workarea').css({
                height: height
            });
            self.aceEditContainer.height(height);
            self.aceEdit.resize();
        });

        self.aceEdit.getSelection().on('changeCursor', function() {
            //self.syncCursor();
        });

        self.aceEdit.getSession().on('changeScrollTop', function(scroll) {
            //scroll = parseInt(scroll) || 0;
            self.syncScroll();
        });

        //http://stackoverflow.com/questions/13677898/how-to-disable-ace-editors-find-dialog
        self.aceEdit.commands.addCommands([{
            name: "findnext",
            bindKey: {
                win: "Ctrl-D",
                mac: "Command-D"
            },
            exec: function(editor, line) {
                console.log(self.aceEdit.getSelection());
                console.log(self.aceEdit.getSelectionRange());
                return false;
            },
            readOnly: true
        }]);
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
            //$('#button-showview').click();
            //self.newButton.click();
            self.fire('windowResized');
            //win.maximize();
            win.show();
        },
        getOptions: function() {
            return this.options;
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
            var pageBody = $('#page-view').contents().find('body');
            pageBody.html(html);

            html = html_beautify(html, {
                indent_size: 4
            });
            //self.aceCode.getSession().getDocument().setValue(html);
            var code = hljs.highlight('xml', html).value;
            pageBody = $('#page-code').contents().find('code');
            pageBody.html(code);

            self.syncScroll();
        },
        syncCursor: function() {
            var self = this;
            var editAll = self.aceEdit.getSession().getDocument().getLength(),
                //codeAll = self.aceCode.getSession().getDocument().getLength(),
                codeAll = 0,
                editRow = self.aceEdit.getCursorPosition().row,
                codeRow = parseInt(editRow * codeAll / editAll);
            // self.aceCode.scrollToLine(codeRow, true, true);
            // self.aceCode.gotoLine(codeRow, 0, true);
        },
        syncScroll: function() {
            var self = this,
                pageBody, ls, lh, rh, rs,
                paneHeight = self.aceEditContainer.height();
            // Sync preview
            pageBody = $('#page-view').contents().find('body');
            ls = self.aceEdit.renderer.getScrollTop() + (paneHeight / 2);
            lh = self.aceEdit.getSession().getScreenLength() * self.aceEdit.renderer.lineHeight;
            rh = pageBody.prop('scrollHeight'),
            rs = parseInt(ls * rh / lh) - (paneHeight / 2);
            if (ls < lh && rs > 0) {
                pageBody.scrollTop(rs);
            }
            //console.log(_.str.sprintf('%d/%d = %d/%d ? %d', ls, lh, rs, rh, pageBody.scrollTop()));
            // Sync HTML code
            pageBody = $('#page-code').contents().find('body');
            rh = pageBody.prop('scrollHeight');
            rs = parseInt(ls * rh / lh) - (paneHeight / 2);
            if (ls < lh && rs > 0) {
                pageBody.scrollTop(rs);
            }
            // console.log(pageBody.innerHeight());
            // console.log(pageBody.height());
            // console.log(pageBody.outerHeight());
            // console.log(pageBody.prop('scrollHeight'));
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