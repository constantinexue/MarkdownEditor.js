(function() {
    "use strict";
    var compileService = require('./js/service-compile')();
    var exportService = require('./js/service-export')();
    mde.Application = klass(function() {
        this.name = 'MarkdownEditor.js';
    }).methods({
        startup: function(options) {
            var self = this;

            self.view = new mde.View(options);
            self.model = new mde.Model();
            self.controller = new mde.Controller(self.view, self.model);
            self.view.init();
            window.mvc = angular.module('mvc', []); //'$strap.directives'
            window.mvc.factory('model', function(historiesService) {
                self.model.historiesService = historiesService;
                return self.model;
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
            }).directive('ngPaneTabs', function($rootScope) {
                return {
                    restrict: 'A',
                    //scope: {},
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
                        $scope.select = function(pane) {
                            $scope.currentPane.selected = false;
                            $scope.currentPane = pane;
                            $scope.currentPane.selected = true;
                        };
                        $('#area-left').css('width', '50%');
                    }
                };
            }).directive('ngPanePages', function($rootScope) {
                return {
                    restrict: 'A',
                    require: '^ngPaneTabs'
                }
            }).controller('HistoriesCtrl', function($scope, $http, historiesService, model) {
                historiesService.on('historiesChanged', function(histories) {
                    $scope.$apply(function() {
                        $scope.histories = histories;
                    });
                });
                $scope.histories = historiesService.getHistories();
                $scope.openFile = function(filename) {
                    self.controller.tryToOpenFile(filename);
                };
            }).controller('editorController', function($scope, $timeout, compileService) {
                self.view.on('contentChanged', function() {
                    $scope.$apply(function() {
                        $timeout.cancel($scope.promise);
                        $scope.promise = $timeout(function() {
                            var md = self.view.getContent();
                            compileService.compile(md)
                                .then(function(html) {
                                    self.view.showCode(html);
                                });
                        }, 1000);
                    });
                });
            }).controller('ExportController', function($scope, $http, exportService, compileService) {
                $scope.export = function(mode, filetype) {
                    var md = self.view.getContent(),
                        filename = '',
                        theme = (mode === 'plain') ? 'none' : 'default';
                    return self.view.selectFile('save', filetype)
                        .then(function(file) {
                            filename = file;
                            return compileService.compile(md, {
                                base64Image: (mode === 'styled2')
                            }, theme);
                        })
                        .then(function(html) {
                            return exportService.export(filename, html);
                        });
                };
                $scope.toHTML = function(mode) {
                    $scope.export(mode, '.html');
                };
                $scope.toPDF = function(mode) {
                    $scope.export(mode, '.pdf');
                };
            }).controller('SettingsController', function($scope, settingsService) {
                //https://groups.google.com/forum/#!topic/angular/WNeY0v9xn1k
                var settings = settingsService.load();
                $scope.settings = settings;
                $scope.apply = function() {
                    self.view.getEditor().setFontSize($scope.settings.editor.fontSize);
                    self.view.getEditor().setTheme('ace/theme/' + $scope.settings.editor.theme);
                };
                $scope.save = function() {
                    $scope.apply();
                    settingsService.save($scope.settings);
                    $('#modal-settings').modal('hide');
                };
                $scope.apply();
                $('#select-font-size').selectpicker('val', settings.editor.fontSize);
                $('#select-editor-theme').selectpicker('val', settings.editor.theme);
            }).run(function() {
                console.log('Angular is started');
            });
            angular.bootstrap('body', ['mvc']);

            //require('./js/server')();
        }
    });
})();
$(function() {
    window.app = new mde.Application();
    app.startup({
        editor: {}
    });
});