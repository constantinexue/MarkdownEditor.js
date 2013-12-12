(function() {
    "use strict";
    var gui = require('nw.gui');

    mde.Application = klass(function() {
        this.name = 'Markdown.js'
    }).methods({
        startup: function(options) {
            var self = this,
                win = gui.Window.get();
            // win.maximize();

            self.view = new mde.View(options);
            self.model = new mde.Model();
            self.controller = new mde.Controller(self.view, self.model);
            // self.controller.openFile('data/example1.md').then(function() {
            //     self.controller.exportToHtml('data/example1.html');
            // });
            win.show();
        }
    });
})();
$(function() {
    var app = new mde.Application();
    app.startup({
        editor: {}
    });
});