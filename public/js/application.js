(function() {
    "use strict";
    var compileService = require('./js/service-compile')();
    var exportService = require('./js/service-export')();

    window.mvc.factory('model', function(historiesService) {
        var model = new mde.Model();
        model.historiesService = historiesService;
        return model;
    }).factory('view', function() {
        return new mde.View();
    }).factory('compileService', function() {
        return compileService;
    }).factory('exportService', function() {
        return exportService;
    }).factory('settingsService', function() {
        return new mde.SettingsService();
    }).factory('historiesService', function() {
        return new mde.HistoriesService();
    }).directive('integer', function() {
        // http://stackoverflow.com/questions/15072152/angularjs-input-model-changes-from-integer-to-string-when-changed
        return {
            require: 'ngModel',
            link: function(scope, ele, attr, ctrl) {
                ctrl.$parsers.unshift(function(viewValue) {
                    return parseInt(viewValue);
                });
            }
        };
    }).directive('ngPaneTabs', function() {
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
    }).controller('historiesController', function($scope, $http, historiesService, model) {
        historiesService.on('historiesChanged', function(histories) {
            $scope.$apply(function() {
                $scope.histories = histories;
            });
        });
        $scope.histories = historiesService.getHistories();
    }).controller('ExportController', function($scope, $http, exportService, compileService, windowService, view) {
        $scope.export = function(mode, filetype) {
            var md = view.getContent(),
                filename = '',
                theme = (mode === 'plain') ? 'none' : 'default';
            view.selectFile('save', filetype)
                .then(function(file) {
                    filename = file;
                    return compileService.compile(md, {
                        base64Image: (mode === 'styled2')
                    }, theme);
                })
                .then(function(html) {
                    return exportService.export(filename, html);
                })
                .then(function() {
                    return windowService.openExternal(filename);
                });
        };
        $scope.toHTML = function(mode) {
            $scope.export(mode, '.html');
        };
        $scope.toPDF = function(mode) {
            $scope.export(mode, '.pdf');
        };
    }).controller('SettingsController', function($scope, settingsService, view) {
        //https://groups.google.com/forum/#!topic/angular/WNeY0v9xn1k
        var settings = settingsService.load();
        $scope.settings = settings;
        $scope.apply = function() {
            view.getEditor().setFontSize($scope.settings.editor.fontSize);
            view.getEditor().setTheme('ace/theme/' + $scope.settings.editor.theme);
        };
        $scope.save = function() {
            $scope.apply();
            settingsService.save($scope.settings);
            $('#modal-settings').modal('hide');
        };
        $scope.apply();
        $('#select-font-size').selectpicker('val', settings.editor.fontSize);
        $('#select-editor-theme').selectpicker('val', settings.editor.theme);
    }).run(function(view, windowService) {
        view.init();
        windowService.show();
        console.log('Angular is started');
    });

    //require('./js/server')();
})();
$(function() {
    angular.bootstrap('html', ['mvc']);
});