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
    var notifySettingsChanged = function() {
        $rootScope.$broadcast('settingsChanged', $scope.settings);
    };
    $scope.save = function() {
        settingsService.save($scope.settings);
        notifySettingsChanged();
        $('#modal-settings').modal('hide');
    };
    notifySettingsChanged();
});