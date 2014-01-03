// Browser module only
(function() {
    mde.SettingsService = klass(function() {
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
    }).methods({
        load: function() {
            var settings = this.get();
            settings = _.extend(this.defaults, settings);
            return settings;
        },
        save: function(settings) {
            settings = _.extend(this.defaults, settings);
            this.set(settings);
        },
        get: function() {
            var jsonString = localStorage.getItem('settings');
            try {
                var settings = JSON.parse(jsonString);
                return (_.isObject(settings)) ? settings : {};
            } catch (err) {
                localStorage.removeItem('settings');
                return {};
            }
        },
        set: function(value) {
            var jsonString = JSON.stringify(value);
            localStorage.setItem('settings', jsonString);
            return this;
        }
    });
})();