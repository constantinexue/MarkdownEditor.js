window.mvc.controller('editorController', function($scope, $timeout, compileService, windowService, publishService, view, dialogView, model) {
    $scope.currentFile = null;
    $scope.isDirty = false;
    $scope.init = function() {
        var steps = getStepsOfSave();
        steps.push(function(confirmed) {
            if (confirmed) {
                view.setContent('Markdown.js\n===========');
                $scope.currentFile = null;
                $scope.isDirty = false;
                $scope.$apply();
            }
            return when.resolve(confirmed);
        });
        return when.pipeline(steps, true);
    };
    $scope.open = function(target) {
        var steps = getStepsOfSave();
        steps.push(function(confirmed) {
            if (target) {
                return when.resolve(target);
            } else {
                return view.selectFile('open', '.md');
            }
        });
        steps.push(function(filename) {
            return openFile(filename);
        });
        return when.pipeline(steps, true);
    };
    $scope.save = function() {
        var steps = [];
        // If this is a new file, prompts user to save
        if (_.isNull($scope.currentFile)) {
            steps.push(function() {
                return view.selectFile('save', '.md');
            });
            steps.push(function(filename) {
                $scope.currentFile = filename;
                $scope.isDirty = true;
                $scope.$apply();
                return when.resolve();
            });
        }
        // File need to be writen to disk if only it is dirty.
        if ($scope.isDirty) {
            steps.push(function() {
                return saveFile($scope.currentFile);
            });
        }
        return when.pipeline(steps);
    };
    $scope.saveas = function() {
        var steps = [];
        steps.push(function() {
            return view.selectFile('save', '.md');
        });
        steps.push(function(filename) {
            $scope.currentFile = filename;
            $scope.isDirty = true;
            $scope.$apply();
            return when.resolve();
        });
        steps.push(function() {
            return saveFile($scope.currentFile);
        });
        return when.pipeline(steps);
    };
    $scope.publish = function(mode, filetype) {
        var md = view.getContent(),
            filename = '',
            defaultFilename = publishService.getDefaultFilename($scope.currentFile, filetype),
            options = compileService.getOptions(),
            optionsOverride = _.extend(options, {
                theme: (mode === 'plain') ? 'none' : options.theme,
                embedImage: mode === 'styled2'
            });
        view.selectFile('save', filetype, defaultFilename)
            .then(function(file) {
                filename = file;
                dialogView.notifyPublishing();
                compileService.setOptions(optionsOverride);
                return compileService.compile(filename, md);
            })
            .then(function(html) {
                return publishService.publish(filename, html);
            })
            .then(function() {
                return windowService.openExternal(filename);
            })
            .ensure(function() {
                compileService.setOptions(options);
            });
    };
    $scope.toHTML = function(mode) {
        $scope.publish(mode, '.html');
    };
    $scope.toPDF = function(mode) {
        $scope.publish(mode, '.pdf');
    };

    function getStepsOfSave() {
        var steps = [];
        if ($scope.isDirty) {
            steps.push(function() {
                return dialogView.promptToSave();
            });
            steps.push(function(willSave) {
                if (willSave) {
                    return $scope.save();
                } else {
                    return when.resolve(true);
                }
            });
        }
        return steps;
    }

    function openFile(filename) {
        return model.loadFile(filename)
            .then(function(content) {
                view.setContent(content);
                $scope.currentFile = filename;
                $scope.isDirty = false;
                // http://stackoverflow.com/questions/15664933/basic-watch-not-working-in-angularjs?answertab=votes#tab-top
                //$scope.$apply();
                $scope.$digest();
                return when.resolve(true);
            });
    }

    function saveFile(filename) {
        var content = view.getContent();
        return model.saveFile(filename, content)
            .then(function() {
                $scope.isDirty = false;
                //$scope.$apply();
                $scope.$digest();
                return when.resolve();
            })
            .then(function() {
                view.prompt('saved');
                return when.resolve(true);
            });
    }

    function updateTitle() {
        var fileTitle = ($scope.currentFile == null) ? 'New File' : $scope.currentFile,
            dirtyTitle = $scope.isDirty ? ' * ' : ' ';
        windowService.setTitle(fileTitle + dirtyTitle);
    }
    $scope.$watch('isDirty', function(newVal, oldVal) {
        updateTitle();
    });
    $scope.$watch('currentFile', function(newVal, oldVal) {
        updateTitle();
    });
    $scope.$on('windowClosing', function(e) {
        var steps = getStepsOfSave();
        steps.push(function(confirmed) {
            if (confirmed) {
                windowService.close();
            }
            return when.resolve(confirmed);
        });
        return when.pipeline(steps, true);
    });
    $scope.$on('settingsChanged', function(e, name, settings) {
        if (name === null || name === 'editor.theme') {
            view.getEditor().setTheme('ace/theme/' + settings.editor.theme);
        }
        if (name === null || name === 'editor.fontSize') {
            view.getEditor().setFontSize(settings.editor.fontSize);
        }
    });
    $scope.$on('themeChanged', function(e, theme) {
        var optionsDefaults = compileService.getOptions(),
            optionsOverride = _.extend(optionsDefaults, {
                theme: theme
            });
        compileService.setOptions(optionsOverride);
        updateCompiling();
    });
    view.on('contentChanged', function() {
        $scope.$apply(function() {
            $scope.isDirty = true;
            $timeout.cancel($scope.promise);
            $scope.promise = $timeout(function() {
                updateCompiling();
            }, 1000);
        });
    });
    view.on('linkClicked', function(href) {
        windowService.openExternal(href);
    });

    function updateCompiling() {
        var md = view.getContent();
        return compileService.compile($scope.currentFile, md)
            .then(function(html) {
                view.showCode(html);
            });
    }
    var eventKeyMap = {
        'mod+n': $scope.init,
        'mod+o': $scope.open,
        'mod+s': $scope.save,
        'mod+shift+s': $scope.saveas
    };
    $.each(eventKeyMap, function(key, value) {
        Mousetrap.bindGlobal(key, function(e) {
            value();
            return false;
        });
    });
});