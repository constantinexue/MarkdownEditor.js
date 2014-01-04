var app = window.mvc;
app.factory('sessionService', function(localStorageService) {
    return klass(function() {

    }).methods({
        get: function(filename) {
            return _.extend({
                theme: 'article-en',
                scroll: 0,
                curser: [0, 0]
            }, localStorageService.get(filename));
        },
        set: function(filename, param) {
            localStorageService.set(filename, param);
        }
    });
});