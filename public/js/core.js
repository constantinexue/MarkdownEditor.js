var mde = window.mde || {};
(function() {
    "use strict";

})();
(function() {
    "use strict";
    mde.EventEmitter = klass(function() {
        this.events = {};
    }).methods({
        on: function(name, callback) {
            if (!this.events.hasOwnProperty(name)) {
                this.events[name] = $.Callbacks();
            }
            this.events[name].add(callback);
            return this;
        },
        fire: function(name, param) {
            if (!this.events.hasOwnProperty(name)) {
                this.events[name] = $.Callbacks();
            }
            this.events[name].fire(param);
            return this;
        }
    });
})();