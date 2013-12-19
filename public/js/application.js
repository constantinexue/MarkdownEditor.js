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

            window.mvc = angular.module('mvc', []);
            window.mvc.factory('model', function() {
                return self.model;
            });
            window.mvc.factory('converter', function() {
                return converter;
            });
            window.mvc.factory('exportService', function() {
                return exportService;
            });
            window.mvc.controller('HistoriesCtrl', function($scope, $http, model) {
                self.model.on('historiesChanged', function(histories) {
                    $scope.$apply(function() {
                        $scope.histories = histories;
                    });
                });
                $scope.histories = model.getHistories();
                $scope.openFile = function(filename) {
                    self.controller.tryToOpenFile(filename);
                };
            });
            window.mvc.controller('ExportController', function($scope, $http, exportService, converter) {
                $scope.toHTML = function() {
                    var md = self.view.getContent();
                    converter.convert(md, {
                        base64Image: true
                    }).then(function(htmlBody) {
                        return exportService.toHTML('./test.html', htmlBody);
                    });
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