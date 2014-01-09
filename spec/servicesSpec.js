describe("A suite", function() {
    beforeEach(function() {
        module('mvc');
        localStorage.clear();
    });
    it('returns 1', inject(function(sessionService) {
        var i = 0;
        for (i = 0; i < 110; i++) {
            var filename = 'filename' + i,
                param = {
                    theme: 'theme' + i,
                    cursor: [i, i]
                };
            sessionService.update(filename, param);
        }
        for (i = 0; i < 10; i++) {
            var filename = 'filename' + i;
            var cursor = sessionService.retrieve(filename).cursor;
            expect(cursor).toEqual([0, 0]);
        }
        for (i = 10; i < 110; i++) {
            var filename = 'filename' + i,
                param1 = {
                    theme: 'theme' + i,
                    cursor: [i, i]
                };
            var param2 = sessionService.retrieve(filename);
            expect(param2).toEqual(param1);
        }
    }));
    describe("Editor", function() {
        xit('test', function() {
            var ele = angular.element('<div></div>');
            var editor = ace.edit(ele[0]);
            editor.setShowPrintMargin(false);
            editor.setHighlightGutterLine(false);
            editor.renderer.setShowGutter(false);
            editor.getSession().setMode("ace/mode/markdown");
            editor.getSession().setUseWrapMode(true);
            console.log(ele.html());
        });
        xit('properties', function(editor) {
            var filename = 'text.md',
                text = '# Header1';
            editor.setFile(filename, text);
            expect(editor.getText()).toEqual(text);
            expect(editor.isDirty()).toBe(false);
        });
        xit('methods', function(editor) {

        });
        xit('events', function(editor, $rootScope) {
            var onFileChanging = function() {},
                onFileChanged = function() {};
            spyOn(onFileChanging);
            spyOn(onFileChanged);
            $rootScope.$on('fileChanging', onFileChanging);
            $rootScope.$on('fileChanged', onFileChanged);
            expect(onFileChanging).toHaveBeenCalled();
            expect(fileChanged).toHaveBeenCalled();
        });
    });
    afterEach(function() {});
});