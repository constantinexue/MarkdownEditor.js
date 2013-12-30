(function() {
    "use strict";

    mde.View = mde.EventEmitter.extend(function() {
        var self = this;
        $(window).resize(function() {
            self.fire('windowResized');
        });

        // Navbar commands
        self.openDialog = $('#dialog-open');
        self.saveDialog = $('#dialog-save');
        // ACE init
        self.editorContainer = $('#ace-edit');
        self.editor = ace.edit(self.editorContainer[0]);
        self.editor.setShowPrintMargin(false);
        self.editor.setHighlightGutterLine(false);
        self.editor.renderer.setShowGutter(false);
        self.editor.getSession().setMode("ace/mode/markdown");
        self.editor.getSession().setUseWrapMode(true);
        self.editor.on('change', function(evt) {
            self.fire('contentChanged');
        });
        self.editor.focus();

        // The padding has to be reset before every resize event.
        //self.editor.renderer.setPadding(10);
        self.editor.resize(true);

        self.on('windowResized', function(evt) {
            var height = $(window).innerHeight() - $('.navbar').outerHeight();
            $('#container-workarea').css({
                height: height
            });
            self.editorContainer.height(height);
        });

        self.editor.getSelection().on('changeCursor', function() {
            //self.syncCursor();
        });

        self.editor.getSession().on('changeScrollTop', function(scroll) {
            //scroll = parseInt(scroll) || 0;
            self.syncScroll();
        });

        //http://stackoverflow.com/questions/13677898/how-to-disable-ace-editors-find-dialog
        self.editor.commands.addCommands([{
            name: "findnext",
            bindKey: {
                win: "Ctrl-D",
                mac: "Command-D"
            },
            exec: function(editor, line) {
                console.log(self.editor.getSelection());
                console.log(self.editor.getSelectionRange());
                return false;
            },
            readOnly: true
        }]);
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

            self._resetEditorPadding();
        },
        _resetEditorPadding: function() {
            var self = this;
            // The padding has to be reset before every resize event.
            self.editor.renderer.setPadding(10);
            self.editor.resize(true);
        },
        getEditor: function() {
            return this.editor;
        },
        showCode: function(html) {
            var self = this,
                container;
            // 
            // container.html(html);

            var viewPage = document.getElementById('page-view');
            viewPage.contentDocument.write(html);
            viewPage.contentDocument.close();

            container = $('#page-view').contents().find('body');
            container.find('a').click(function(evt) {
                evt.preventDefault();
                var href = $(this).attr('href');
                self.fire('linkClicked', href);
            });

            html = html_beautify(html, {
                indent_size: 4
            });
            // var code = hljs.highlight('xml', html).value;
            container = $('#page-code').contents().find('code');
            container.text(html);

            self.syncScroll();
        },
        syncCursor: function() {
            var self = this;
            var editAll = self.editor.getSession().getDocument().getLength(),
                //codeAll = self.aceCode.getSession().getDocument().getLength(),
                codeAll = 0,
                editRow = self.editor.getCursorPosition().row,
                codeRow = parseInt(editRow * codeAll / editAll);
            // self.aceCode.scrollToLine(codeRow, true, true);
            // self.aceCode.gotoLine(codeRow, 0, true);
        },
        syncScroll: function() {
            var self = this,
                pageBody, ls, lh, rh, rs,
                paneHeight = self.editorContainer.height();
            // Sync preview
            pageBody = $('#page-view').contents().find('body');
            ls = self.editor.renderer.getScrollTop() + (paneHeight / 2);
            lh = self.editor.getSession().getScreenLength() * self.editor.renderer.lineHeight;
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
            self.editor.getSession().setValue(value);
            self.editor.gotoLine(0);
            self.editor.focus();

            //self._resetEditorPadding();
        },
        getContent: function() {
            var self = this,
                doc = self.editor.getSession().getDocument();
            return doc.getValue();
        },
        selectFile: function(mode, type, defaultFilename, workingDir) {
            var self = this,
                dialog = null,
                deferred = when.defer();
            switch (mode) {
                case 'open':
                    dialog = self.openDialog;
                    break;
                case 'save':
                    dialog = self.saveDialog;
                    if (defaultFilename) {
                        dialog.attr('nwsaveas', defaultFilename);
                    } else {
                        dialog.attr('nwsaveas', '');
                    }
                    break;
                default:
                    return;
            }
            if (workingDir) {
                dialog.attr('nwworkingdir', workingDir);
            } else {
                dialog.removeAttr('nwworkingdir');
            }
            dialog.attr('accept', type);
            dialog.off('change');
            dialog.on('change', function(evt) {
                var selectedFile = $(this).val();
                if (!_.str.endsWith(selectedFile, type)) {
                    selectedFile += type;
                }
                deferred.resolve(selectedFile);
                $(this).val('');
            });
            dialog.trigger('click');

            return deferred.promise;
        }
    });
})();