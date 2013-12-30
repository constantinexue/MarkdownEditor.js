window.mvc.factory('windowService', function($rootScope) {
    var gui = require('nw.gui'),
        win = gui.Window.get();
    win.on('close', function() {
        $rootScope.$broadcast('windowClosing');
    });
    // https://groups.google.com/forum/#!topic/node-webkit/LIcbwBrF_CI
    $('a[target="_system"]').click(function(evt) {
        evt.preventDefault();
        var link = $(this).attr('href');
        gui.Shell.openExternal(link);
    });

    return {
        show: function() {
            var deferred = when.defer();
            win.hide();
            // This API will cause window showing on windows.
            // https://github.com/rogerwang/node-webkit/issues/1350
            win.maximize();
            win.hide();
            setTimeout(function() {
                win.show();
                window.splash.close();
                deferred.resolve();
            }, 1000);
            return deferred.promise;
        },
        setTitle: function(title) {
            win.title = title + '- MarkdownEditor.js';
        },
        close: function() {
            $rootScope.$broadcast('windowClosed');
            win.close(true);
        },
        openExternal: function(link) {
            link = 'file://' + link;
            gui.Shell.openExternal(link);
        }
    };
});