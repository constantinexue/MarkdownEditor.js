$(function() {
    document.showHtml = function(html) {
        var beautify_html = require('js-beautify').html;
        html = beautify_html(html, {
            indent_size: 4
        });
        $('code').text(html);
        $('code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
        $('body').css({
            backgroundColor: $('code').css('background-color')
        });
    };
});