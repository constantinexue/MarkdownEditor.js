app.controller('rootController', function($scope, $rootScope) {});

app.controller('historiesController', function($scope, historiesService, dialogView) {
    historiesService.on('historiesChanged', function(histories) {
        $scope.$apply(function() {
            $scope.histories = histories;
        });
    });
    $scope.histories = historiesService.retrieveAll();
    $scope.openHistory = function(file) {
        $scope.open(file)
            .done(null, function(err) {
                return dialogView.promptInvalidHistory(file)
                    .then(function() {
                        return historiesService.delete(file);
                    });
            });
    };
});
app.controller('settingsController', function($scope, $rootScope, settingsService) {
    //https://groups.google.com/forum/#!topic/angular/WNeY0v9xn1k
    var settings = settingsService.load();
    $scope.settings = settings;
    var onSettingsChanged = function(name) {
        $rootScope.$broadcast('settingsChanged', name, $scope.settings);
    };
    $scope.$watch('settings.editor.theme', function(newVal, oldVal) {
        onSettingsChanged('editor.theme');
    });
    $scope.$watch('settings.editor.fontSize', function(newVal, oldVal) {
        onSettingsChanged('editor.fontSize');
    });
    onSettingsChanged(null);
});
app.controller('themeController', function($scope, $rootScope, themeService) {
    var themeNames = themeService.retrieveNames();
    $scope.currentTheme = null;
    $scope.themes = [];
    themeNames.forEach(function(themeName) {
        $scope.themes.push({
            name: themeName,
            selected: false
        });
    });
    var onThemeChanged = function(theme) {
        if ($scope.currentTheme) {
            $scope.currentTheme.selected = false;
        }
        $scope.currentTheme = theme;
        $scope.currentTheme.selected = true;
        $rootScope.$broadcast('themeChanged', $scope.currentTheme.name);
    };
    $scope.selectTheme = function(theme) {
        onThemeChanged(theme);
    };
    $scope.getTheme = function(name) {
        var target = null;
        $scope.themes.forEach(function(theme) {
            if (theme.name == name) {
                target = theme;
                return;
            }
        });
        return target;
    };
});
app.controller('sessionController', function($scope, $rootScope, sessionService, compileService, view) {
    var buildParam = function() {
        var pos = view.getEditor().getCursorPosition();
        var param = {
            theme: compileService.getOptions().theme,
            cursor: [pos.row, pos.column]
        };
        return param;
    };
    var currentParam = null;
    var update = function() {
        if ($scope.currentFile) {
            currentParam = buildParam();
        }
    };
    $scope.$on('themeChanged', function(evt) {
        update();
    });
    $scope.$on('cursorChanged', function(evt) {
        update();
    });
    $scope.$on('fileClosed', function(evt) {
        sessionService.update($scope.currentFile, currentParam);
    });
    $scope.$on('fileOpened', function(evt, filename) {
        var param = sessionService.retrieve(filename);
        var theme = $scope.getTheme(param.theme);
        $scope.selectTheme(theme);
        // row + 1 is hacking bug, the cursor will not be placed to right position.
        view.getEditor().gotoLine(param.cursor[0] + 1, param.cursor[1], true);
        view.getEditor().scrollToLine(param.cursor[0], true, true);
    });
    $scope.$on('fileInited', function(evt) {
        var param = sessionService.getDefaults();
        var theme = $scope.getTheme(param.theme);
        $scope.selectTheme(theme);
    });
});
app.controller('aceController', function($scope, $rootScope) {
    $scope.content = {
        text: 'text'
    };
});