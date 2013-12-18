(function() {
    "use strict";

    mde.Controller = klass(function(view, model) {
        var self = this;
        self.currentFile = null;
        self.isDirty = false;
        self.currentTimerId = null;
        self.view = view;
        self.model = model;
        self.view.on('newButtonClicked', function() {
            return self.onNewButtonClicked();
        }).on('openButtonClicked', function() {
            return self.onOpenButtonClicked();
        }).on('saveButtonClicked', function() {
            return self.onSaveButtonClicked();
        }).on('saveAsButtonClicked', function() {
            return self.onSaveAsButtonClicked();
        }).on('contentChanged', function() {
            self.changeDirty(true);
            if (!_.isNull(self.currentTimerId)) {
                clearTimeout(self.currentTimerId);
            }
            self.currentTimerId = setTimeout(function() {
                var content = self.view.getContent();
                self.model.md2html(content).then(function(html) {
                    self.view.showCode(html);
                });
                //contents_modified = true;
                //spell_check(self.view.getEditor().getSession());
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
        }).on('windowClosing', function() {
            return self.onWindowClosing();
        });
    }).methods({
        getStepsOfSave: function() {
            var self = this,
                steps = [];
            if (self.isDirty) {
                steps.push(function() {
                    return self.view.promptToSave();
                });
                steps.push(function(willSave) {
                    if (willSave) {
                        return self.onSaveButtonClicked();
                    } else {
                        return when.resolve(true);
                    }
                });
            }
            return steps;
        },
        onWindowClosing: function() {
            var self = this,
                steps = self.getStepsOfSave();
            steps.push(function(confirmed) {
                if (confirmed) {
                    self.view.close();
                }
                return when.resolve(confirmed);
            });
            return when.pipeline(steps, true);
        },
        onNewButtonClicked: function() {
            var self = this,
                steps = self.getStepsOfSave();
            steps.push(function(confirmed) {
                if (confirmed) {
                    self.changeCurrentFile(null);
                    self.view.setContent('Markdown.js\n===========');
                    self.changeDirty(false);
                }
                return when.resolve(confirmed);
            });
            return when.pipeline(steps, true);
        },
        onOpenButtonClicked: function() {
            var self = this,
                steps = self.getStepsOfSave();
            steps.push(function(confirmed) {
                return self.view.selectFile('open', '.md');
            });
            steps.push(function(filename) {
                return self.openFile(filename);
            });
            return when.pipeline(steps, true);
        },
        onSaveButtonClicked: function() {
            var self = this,
                steps = [];
            // If this is a new file, prompts user to save
            if (_.isNull(self.currentFile)) {
                steps.push(function() {
                    return self.view.selectFile('save', '.md');
                });
                steps.push(function(filename) {
                    self.changeCurrentFile(filename);
                    self.changeDirty(true);
                    return when.resolve();
                });
            }
            // File need to be writen to disk if only it is dirty.
            if (self.isDirty) {
                steps.push(function() {
                    return self.saveFile(self.currentFile);
                });
            }
            return when.pipeline(steps);
        },
        onSaveAsButtonClicked: function() {
            var self = this,
                steps = [];

            steps.push(function() {
                return self.view.selectFile('save', '.md');
            });
            steps.push(function(filename) {
                self.changeCurrentFile(filename);
                self.changeDirty(true);
                return when.resolve();
            });
            steps.push(function(filename) {
                return self.saveFile(self.currentFile);
            });
            return when.pipeline(steps);
        },
        tryToOpenFile: function(filename) {
            var self = this,
                steps = self.getStepsOfSave();
            steps.push(function(confirmed) {
                if (confirmed) {
                    self.openFile(filename);
                }
                return when.resolve(confirmed);
            });
            return when.pipeline(steps, true);
        },
        openFile: function(filename) {
            var self = this;
            return self.model.loadFile(filename).then(function(content) {
                self.changeCurrentFile(filename);
                self.view.setContent(content);
                self.changeDirty(false);
                return when.resolve(true);
            });
        },
        saveFile: function() {
            var self = this,
                content = self.view.getContent();
            return self.model.saveFile(self.currentFile, content).then(function() {
                self.changeDirty(false);
                return when.resolve();
            }).then(function() {
                self.view.prompt('saved');
                return when.resolve(true);
            });
        },
        exportToHtml: function(htmlFile) {
            var self = this,
                html = self.view.getCode('styled');
            return self.model.saveFile(htmlFile, html).then(function() {
                self.view.prompt('exported');
                return when.resolve(true);
            });;
        },
        changeCurrentFile: function(filename) {
            this.currentFile = filename;
            this.changeTitle();
            return this;
        },
        changeDirty: function(isDirty) {
            this.isDirty = isDirty;
            this.changeTitle();
            return this;
        },
        changeTitle: function() {
            var fileTitle = (this.currentFile == null) ? 'New File' : this.currentFile,
                dirtyTitle = this.isDirty ? ' * ' : ' ';
            this.view.setTitle(fileTitle + dirtyTitle);
            return this;
        }
    });
})();