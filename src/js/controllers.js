window.mvc.controller('historiesController', function($scope, $http, historiesService, dialogView) {
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
}).controller('publishController', function($scope, $http, publishService, compileService, windowService, dialogView, view) {
    $scope.publish = function(mode, filetype) {
        var md = view.getContent(),
            filename = '',
            options = compileService.getOptions(),
            optionsOverride = _.extend(options, {
                theme: (mode === 'plain') ? 'none' : options.theme,
                embedImage: mode === 'styled2'
            });
        view.selectFile('save', filetype)
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
}).controller('settingsController', function($scope, $rootScope, settingsService, compileService, view) {
    //https://groups.google.com/forum/#!topic/angular/WNeY0v9xn1k
    var settings = settingsService.load();
    $scope.settings = settings;
    $scope.apply = function() {
        view.getEditor().setFontSize($scope.settings.editor.fontSize);
        view.getEditor().setTheme('ace/theme/' + $scope.settings.editor.theme);
        view.getEditor().resize();
        $rootScope.$broadcast('settingsChanged', $scope.settings);
    };
    $scope.save = function() {
        $scope.apply();
        settingsService.save($scope.settings);
        $('#modal-settings').modal('hide');
    };
    $scope.apply();
    $('#select-font-size').selectpicker('val', settings.editor.fontSize);
    $('#select-editor-theme').selectpicker('val', settings.editor.theme);
});