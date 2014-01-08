(function() {
    "use strict";
    var app = window.mvc;
    app.factory('view', function() {
        return new mde.View();
    });
    app.factory('compileService', function(themeService) {
        return require('./js/service-compile')(themeService);
    });
    app.factory('publishService', function() {
        return require('./js/service-publish')();
    });
    app.factory('themeService', function() {
        var ThemeService = require('./js/services-node').ThemeService;
        return new ThemeService();
    });
    app.factory('fileAccessService', function() {
        var FileAccessService = require('./js/services-node').FileAccessService;
        return new FileAccessService();
    });
    app.run(function(view, windowService) {
        windowService.show().then(function() {
            view.init();
        });
    });
    //require('./js/server')();
})();
$(function() {
    angular.bootstrap('html', ['mvc']);
});