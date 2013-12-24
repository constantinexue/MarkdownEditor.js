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
            win.maximize();
            win.show();
        },
        setTitle: function(title) {
            win.title = title + '- MarkdownEditor.js';
        },
        close: function() {
            $rootScope.$broadcast('windowClosed');
            win.close(true);
        },
        openExternal: function(link) {
            gui.Shell.openExternal(link);
        }
    };
});