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
            theme = (mode === 'plain') ? 'none' : 'default';
        view.selectFile('save', filetype)
            .then(function(file) {
                filename = file;
                dialogView.notifyPublishing();
                return compileService.compile(md, {
                    base64Image: (mode === 'styled2')
                }, theme);
            })
            .then(function(html) {
                return publishService.publish(filename, html);
            })
            .then(function() {
                console.log(filename);
                return windowService.openExternal(filename);
            });
    };
    $scope.toHTML = function(mode) {
        $scope.publish(mode, '.html');
    };
    $scope.toPDF = function(mode) {
        $scope.publish(mode, '.pdf');
    };
}).controller('SettingsController', function($scope, settingsService, view) {
    //https://groups.google.com/forum/#!topic/angular/WNeY0v9xn1k
    var settings = settingsService.load();
    $scope.settings = settings;
    $scope.apply = function() {
        view.getEditor().setFontSize($scope.settings.editor.fontSize);
        view.getEditor().setTheme('ace/theme/' + $scope.settings.editor.theme);
        view.getEditor().resize();
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