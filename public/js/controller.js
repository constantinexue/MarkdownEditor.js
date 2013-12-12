(function() {
    "use strict";

    mde.Controller = klass(function(view, model) {
        var self = this;
        self.currentFile = null;
        self.isDirty = false;
        self.currentTimerId = null;
        self.view = view;
        self.model = model;
        self.view.on('openButtonClicked', function() {
            var promise = when.resolve();
            if (self.isDirty) {
                promise = promise.then(function() {
                    return self.view.promptToSave();
                }).then(function(save) {
                    if (save) {
                        self.view.fire('saveButtonClicked');
                    }
                    return when.resolve();
                });
            }
            promise.then(function() {
                return self.view.selectFile('open');
            }).then(function(filename) {
                return self.openFile(filename);
            });
        }).on('saveButtonClicked', function() {
            var promise = when.resolve();
            // If this is a new file, prompts user to save
            if (_.isNull(self.currentFile)) {
                promise = promise.then(function() {
                    return self.view.selectFile('save');
                }).then(function(filename) {
                    self.currentFile = filename;
                    self.isDirty = true;
                    return when.resolve();
                });
            }
            // File need to be writen to disk if only it is dirty.
            if (self.isDirty) {
                promise.then(function() {
                    return self.saveFile(self.currentFile);
                });
            }
        }).on('contentChanged', function() {
            self.isDirty = true;
            if (!_.isNull(self.currentTimerId)) {
                clearTimeout(self.currentTimerId);
            }
            self.currentTimerId = setTimeout(function() {
                var content = self.view.getContent();
                self.model.md2html(content).then(function(html) {
                    self.view.showCode(html);
                });
            }, 1000);
        }).on('exportHtmlPlainButtonClick', function() {
            var htmlFile = null,
                htmlText = null;
            self.view.selectFile('save', '.html').then(function(filename) {
                htmlText = self.view.getCode();
                htmlFile = filename;
                return when.resolve();
            }).then(function() {
                return self.model.exportToHtml(htmlFile, htmlText);
            });
        });
    }).methods({
        openFile: function(filename) {
            var self = this;
            return self.model.loadFile(filename).then(function(content) {
                self.currentFile = filename;
                self.view.setContent(content);
                self.isDirty = false;
                return when.resolve();
            });
        },
        saveFile: function() {
            var self = this,
                content = self.view.getContent();
            self.model.saveFile(self.currentFile, content).then(function() {
                self.isDirty = false;
            });
        },
        exportToHtml: function(htmlFile) {
            var self = this,
                html = self.view.getCode();
            return self.model.exportToHtml(htmlFile, html);
        }
    });
})();