(function(exports) {
    var LS_NAME = 'sessions';
    var SessionService = klass(function(localStorageService) {
        this.sessions = localStorageService.get(LS_NAME) || [];
        this.maxCount = 100;
        this.localStorageService = localStorageService;
    }).methods({
        retrieveSession: function(filename) {
            var session = this.find(filename),
                defaults = {
                    theme: 'article-en',
                    cursor: [0, 0]
                };
            if (_.isNull(session)) {
                return defaults;
            } else {
                return _.defaults(session.param, defaults);
            }
        },
        updateSession: function(filename, param) {
            var session = this.find(filename);
            if (!_.isNull(session)) {
                // Removes from array
                this.sessions = _.without(this.sessions, session);
            }
            // Adds to head
            this.sessions.unshift({
                filename: filename,
                param: param
            });
            // Keeps the top [maxCount]
            this.sessions = this.sessions.slice(0, this.maxCount);
            // Writes to localStorage
            this.localStorageService.set(LS_NAME, this.sessions);
        },
        find: function(filename) {
            var target = null;
            _.each(this.sessions, function(session) {
                if (_.isString(session.filename) && session.filename === filename) {
                    target = session;
                    return;
                }
            });
            return target;
        }
    });
    exports = SessionService;
})(window.mde || {});

(function(exports) {
    var LocalStorageService = klass(function() {}).methods({
        get: function(name) {
            var value = localStorage.getItem(name);
            if (!value || value === 'null') {
                return null;
            }
            if (value.charAt(0) === "{" || value.charAt(0) === "[") {
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
    exports = LocalStorageService;
})(window.mde || {});