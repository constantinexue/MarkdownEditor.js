// var editor = new EpicEditor({
//     basePath: '/public/vendor/epic',
//     textarea: 'content',
//     autogrow: true,
//     clientSideStorage: false,
//     theme: {
//         base: '/themes/base/epiceditor.css',
//         preview: '/themes/preview/preview-dark.css',
//         editor: '/themes/editor/epic-dark.css'
//     }
// }).load();
// editor.enterFullscreen();
$(function() {
    var editor = ace.edit("editor");
    editor.setFontSize(16);
    editor.setHighlightGutterLine(false);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/markdown");
    // editor.getSession().setMode("ace/mode/javascript");
    var heightUpdateFunction = function() {

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
    heightUpdateFunction();

    // Whenever a change happens inside the ACE editor, update
    // the size again
    editor.getSession().on('change', heightUpdateFunction);
});