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
        .run(function(view, windowService) {
            view.init();
            windowService.show();
        });

    //require('./js/server')();
})();
$(function() {
    angular.bootstrap('html', ['mvc']);
});