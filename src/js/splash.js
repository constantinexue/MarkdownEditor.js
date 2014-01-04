(function() {
    var Splash = function() {
        var gui = require('nw.gui');
        var self = this;
        self.open = function() {
            self.win = gui.Window.open('splash.html', {
                "title": 'Welcome to MarkdownEditor.js',
                position: 'center',
                width: 640,
                height: 480,
                "always-on-top": true,
                toolbar: false,
                frame: false,
                show: false
            });
            // FUCK: It's a bug of 'center' position doesn't work.
            // Force to hide and show the window.
            self.win.show();
        };
        self.close = function() {
            self.win.close('true');
        };
    };
    window.splash = new Splash();
    window.splash.open();
})();