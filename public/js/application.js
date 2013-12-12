(function() {
    "use strict";
    var gui = require('nw.gui');

    mde.Application = klass(function() {
        this.name = 'Markdown.js'
    }).methods({
        startup: function(options) {
            var win = gui.Window.get();
            // win.maximize();

            this.view = new mde.View(options);
            this.model = new mde.Model();
            this.controller = new mde.Controller(this.view, this.model);
            this.controller.openFile('data/example1.md');
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