var app = window.mvc;
app.factory('sessionService', function(localStorageService) {
    var SessionService = klass(function() {

    }).methods({
        retrieveSession: function(filename) {
            return _.extend({
                theme: 'article-en',
                cursor: [0, 0]
            }, localStorageService.get(filename));
        },
        updateSession: function(filename, param) {
            localStorageService.set(filename, param);
        }
    });

    return new SessionService();
});
app.factory('localStorageService', function() {
    var LocalStorageService = klass(function() {}).methods({
        get: function(name) {
            var value = localStorage.getItem(name);
            if (!value || value === 'null') {
                return null;
            }
            if (value.charAt(0) === "{" || item.charAt(0) === "[") {
                try {
                    value = angular.fromJson(value);
                    return value;
                } catch (err) {
                    localStorage.removeItem(name);
                    return null;
                }
            } else {
                return value;
            }
        },
        set: function(name, value) {
            if (angular.isObject(value) || angular.isArray(value)) {
                value = angular.toJson(value);
                localStorage.setItem(name, value);
            }
            return this;
        }
    });
    return new LocalStorageService();
});