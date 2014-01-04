var app = window.mvc;
app.factory('localStorageService', function() {
    return klass(function() {

    }).methods({
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
});