var editor = new EpicEditor({
    basePath: '/public/vendor/epic',
    textarea: 'content',
    autogrow: true,
    clientSideStorage: false,
    theme: {
        base: '/themes/base/epiceditor.css',
        preview: '/themes/preview/preview-dark.css',
        editor: '/themes/editor/epic-dark.css'
    }
}).load();