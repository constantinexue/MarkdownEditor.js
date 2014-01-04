var app = window.mvc;
app.controller('historiesController', function($scope, historiesService, dialogView) {
    historiesService.on('historiesChanged', function(histories) {
        $scope.$apply(function() {
            $scope.histories = histories;
        });
    });
    $scope.histories = historiesService.getHistories();
    $scope.openHistory = function(file) {
        $scope.open(file)
            .done(null, function(err) {
                return dialogView.promptInvalidHistory(file)
                    .then(function() {
                        return historiesService.deleteHistory(file);
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
    var themeNames = themeService.retrieveNames(),
        currentTheme = null;
    var onThemeChanged = function(theme) {
        if (currentTheme) {
            currentTheme.selected = false;
        }
        currentTheme = theme;
        currentTheme.selected = true;
        $rootScope.$broadcast('themeChanged', currentTheme.name);
    };
    $scope.selectTheme = function(theme) {
        onThemeChanged(theme);
    };
    $scope.themes = [];
    themeNames.forEach(function(themeName) {
        $scope.themes.push({
            name: themeName,
            selected: false
        });
    });
    onThemeChanged($scope.themes[0]);
});