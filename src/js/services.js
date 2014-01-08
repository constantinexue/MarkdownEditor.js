app.factory('sessionService', function(localStorageService) {
    var LS_NAME = 'sessions';
    var SessionService = klass(function(localStorageService) {
        this.sessions = localStorageService.get(LS_NAME) || [];
        this.maxCount = 100;
        this.localStorageService = localStorageService;
    }).methods({
        retrieve: function(filename) {
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
        update: function(filename, param) {
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
    return new SessionService(localStorageService);
});
app.factory('historiesService', function(localStorageService) {
    var LS_NAME = 'histories';
    var HistoriesService = mde.EventEmitter.extend(function() {
        this.localStorageService = localStorageService;
    }).methods({
        retrieveAll: function() {
            var histories = this.localStorageService.get(LS_NAME);
            return histories || [];
        },
        update: function(file) {
            var histories = this.localStorageService.get(LS_NAME);
            histories = _.without(histories, file);
            // Add to the head
            histories.unshift(file);
            // Keep top 10
            histories = histories.slice(0, 10);
            this.localStorageService.set(LS_NAME, histories);
            this.fire('historiesChanged', histories);

            return when.resolve(histories);
        },
        delete: function(file) {
            var histories = this.localStorageService.get(LS_NAME);

            histories = _.without(histories, file);
            this.localStorageService.set(LS_NAME, histories);
            this.fire('historiesChanged', histories);

            return when.resolve(histories);
        }
    });
    return new HistoriesService(localStorageService);
});
app.factory('settingsService', function(localStorageService) {
    var LS_NAME = 'settings';
    var SettingsService = klass(function(localStorageService) {
        this.defaults = {
            editor: {
                fontSize: 14,
                theme: 'chrome',
                wrap: true
            },
            markdown: {
                theme: 'article-cn'
            }
        };
        this.localStorageService = localStorageService;
    }).methods({
        load: function() {
            var settings = this.localStorageService.get(LS_NAME) || {};
            settings = _.defaults(settings, this.defaults);
            return settings;
        },
        save: function(settings) {
            settings = _.defaults(settings, this.defaults);
            this.localStorageService.set(LS_NAME, settings);
        }
    });
    return new SettingsService(localStorageService);
});
app.factory('localStorageService', function() {
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
    return new LocalStorageService();
});