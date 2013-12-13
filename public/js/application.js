(function() {
    "use strict";

    mde.Application = klass(function() {
        this.name = 'Markdown.js'
    }).methods({
        startup: function(options) {
            var self = this;

            self.view = new mde.View(options);
            self.model = new mde.Model();
            self.controller = new mde.Controller(self.view, self.model);
            self.view.init();
            //self.controller.openFile('data/example2.md');
        }
    });
})();
$(function() {
    var app = new mde.Application();
    app.startup({
        editor: {}
    });
});