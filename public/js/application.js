(function() {
    "use strict";

    mde.Application = klass(function() {
        this.name = 'Markdown.js'
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
            window.mvc.controller('HistoriesCtrl', function($scope, $http, model) {
                self.model.on('historiesChanged', function(histories) {
                    $scope.$apply(function() {
                        $scope.histories = histories;
                    });
                });
                $scope.histories = model.getHistories();
            });
            angular.bootstrap('#list-histories', ['mvc']);
        }
    });
})();
$(function() {
    window.app = new mde.Application();
    app.startup({
        editor: {}
    });
});