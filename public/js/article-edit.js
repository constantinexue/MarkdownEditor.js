$(function() {
    var editor = ace.edit("editor");
    editor.setFontSize(16);
    editor.setShowPrintMargin(false);
    editor.setHighlightGutterLine(false);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/markdown");
    editor.getSession().setUseWrapMode(true);

    $('#editor').css({
        fontFamily: "consolas",
        height: window.innerHeight - 85
    });
    console.log(window.innerHeight);
    $(window).resize(function() {
        $("#editor").height($(window).innerHeight() - 85);
        console.log(window.innerHeight);
    });

    var expandEditorHeight = function() {

        // http://stackoverflow.com/questions/11584061/
        var newHeight =
            editor.getSession().getScreenLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();

        $('#editor').height(newHeight.toString() + "px");
        $('#editor-section').height(newHeight.toString() + "px");

        // This call is required for the editor to fix all of
        // its inner structure for adapting to a change in size
        editor.resize();
    };

    // Set initial size to match initial content
    //expandEditorHeight();

    // Whenever a change happens inside the ACE editor, update
    // the size again
    //editor.getSession().on('change', expandEditorHeight);
});