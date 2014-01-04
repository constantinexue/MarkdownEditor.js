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
        .factory('compileService', function(themeService) {
            return require('./js/service-compile')(themeService);
        })
        .factory('publishService', function() {
            return require('./js/service-publish')();
        })
        .factory('themeService', function() {
            return require('./js/service-theme')();
        })
        .factory('settingsService', function() {
            return new mde.SettingsService();
        })
        .factory('historiesService', function() {
            return new mde.HistoriesService();
        })
        .run(function(view, windowService) {
            windowService.show().then(function(){
            view.init();
                
            });
        });

    //require('./js/server')();
})();
$(function() {
    angular.bootstrap('html', ['mvc']);
});