(function() {
    "use strict";

    var Converter = require('./js/converter');
    var converter = new Converter();
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
            window.mvc.factory('model', function() {
                return self.model;
            }).factory('converter', function() {
                return converter;
            }).factory('exportService', function() {
                return exportService;
            }).factory('settingsService', function() {
                return new mde.SettingsService();
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
            }).controller('HistoriesCtrl', function($scope, $http, model) {
                self.model.on('historiesChanged', function(histories) {
                    $scope.$apply(function() {
                        $scope.histories = histories;
                    });
                });
                $scope.histories = model.getHistories();
                $scope.openFile = function(filename) {
                    self.controller.tryToOpenFile(filename);
                };
            }).controller('ExportController', function($scope, $http, exportService, converter) {
                $scope.toHTML = function(mode) {
                    var md = self.view.getContent(),
                        filename = '';
                    self.view.selectFile('save', '.html').then(function(file) {
                        filename = file;
                        return converter.convert(md, {
                            base64Image: (mode === 'styled2')
                        });
                    }).then(function(htmlBody) {
                        mode = (mode === 'styled2') ? 'styled' : mode;
                        return exportService.toHTML(filename, htmlBody, mode);
                    });
                };
                $scope.toPDF = function(mode) {
                    var md = self.view.getContent(),
                        filename = '';
                    self.view.selectFile('save', '.pdf').then(function(file) {
                        filename = file;
                        return converter.convert(md, {
                            base64Image: (mode === 'styled2')
                        });
                    }).then(function(htmlBody) {
                        mode = (mode === 'styled2') ? 'styled' : mode;
                        return exportService.toPDF(filename, htmlBody, mode);
                    });
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