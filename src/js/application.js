(function() {
    "use strict";
    window.mvc.factory('model', function(historiesService) {
        var model = new mde.Model();
        model.historiesService = historiesService;
        return model;
    })
        .factory('view', function() {
            return new mde.View();
        })
        .factory('compileService', function() {
            return require('./js/service-compile')();
        })
        .factory('publishService', function() {
            return require('./js/service-publish')();
        })
        .factory('settingsService', function() {
            return new mde.SettingsService();
        })
        .factory('historiesService', function() {
            return new mde.HistoriesService();
        })
        .directive('integer', function() {
            // http://stackoverflow.com/questions/15072152/angularjs-input-model-changes-from-integer-to-string-when-changed
            return {
                require: 'ngModel',
                link: function(scope, ele, attr, ctrl) {
                    ctrl.$parsers.unshift(function(viewValue) {
                        return parseInt(viewValue);
                    });
                }
            };
        })
        .directive('ngPaneTabs', function() {
            return {
                restrict: 'A',
                scope: false,
                controller: function($scope) {
                    $scope.currentPane = $scope.viewPane = {
                        selected: true
                    };
                    $scope.codePane = {
                        selected: false
                    };
                    $scope.helpPane = {
                        selected: false
                    };
                    $scope.selectPane = function(pane) {
                        $scope.currentPane.selected = false;
                        $scope.currentPane = pane;
                        $scope.currentPane.selected = true;
                    };
                    //$('#area-left').css('width', '50%');
                }
            };
        }).directive('ngPanePages', function($rootScope) {
            return {
                restrict: 'A',
                require: '^ngPaneTabs'
            }
        })
        .run(function(view, windowService) {
            view.init();
            windowService.show();
        });

    //require('./js/server')();
})();
$(function() {
    angular.bootstrap('html', ['mvc']);
});