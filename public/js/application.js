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
            //self.controller.openFile('data/example2.md');

            window.mvc = angular.module('mvc', []); //'$strap.directives'
            window.mvc.factory('model', function() {
                return self.model;
            }).factory('converter', function() {
                return converter;
            }).factory('exportService', function() {
                return exportService;
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
            }).controller('SettingsController', function($scope) {
                $scope.fontSize = self.view.getOptions().editor.fontSize;
                $('#select-font-size').selectpicker('val', $scope.fontSize);
                $scope.editorTheme = self.view.getEditor().getTheme().substring(10); //ace/theme/twilight
                $('#select-editor-theme').selectpicker('val', $scope.editorTheme);

                $scope.save = function() {
                    var fontSize = parseInt($scope.fontSize),
                        editorTheme = 'ace/theme/' + $scope.editorTheme;
                    self.view.getEditor().setFontSize(fontSize);
                    self.view.getEditor().setTheme(editorTheme);
                    $('#modal-settings').modal('hide');
                };
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