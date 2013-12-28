window.mvc.controller('historiesController', function($scope, historiesService, dialogView) {
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
}).controller('publishController', function($scope, publishService, compileService, windowService, dialogView, view) {
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
}).controller('settingsController', function($scope, $rootScope, settingsService) {
    //https://groups.google.com/forum/#!topic/angular/WNeY0v9xn1k
    var settings = settingsService.load();
    $scope.settings = settings;
    var notifySettingsChanged = function() {
        $rootScope.$broadcast('settingsChanged', $scope.settings);
    };
    $scope.save = function() {
        settingsService.save($scope.settings);
        notifySettingsChanged();
        $('#modal-settings').modal('hide');
    };
    notifySettingsChanged();
    // $('#select-font-size').selectpicker('val', settings.editor.fontSize);
    // $('#select-editor-theme').selectpicker('val', settings.editor.theme);
});