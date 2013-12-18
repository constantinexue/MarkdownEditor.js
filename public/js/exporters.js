(function() {
    "use strict";

    var klass = klass || require('klass'),
        when = when || require('when');

    var Exporter = klass(function() {

    }).methods({
        toHtml: function(filename, html) {

        },
        toHtmlWithImages: function(filename, html) {

        },
        toPdf: function(filename, html) {

        },
        toImage: function(filename, html) {

        }
    });

    if (typeof exports === 'object') {
        module.exports = Converter;
    } else {
        window.mde.Converter = Converter;
    }

})();