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
            sessionService.updateSession(filename, param);
        }
        for (i = 0; i < 10; i++) {
            var filename = 'filename' + i;
            var cursor = sessionService.retrieveSession(filename).cursor;
            expect(cursor).toEqual([0, 0]);
        }
        for (i = 10; i < 110; i++) {
            var filename = 'filename' + i,
                param1 = {
                    theme: 'theme' + i,
                    cursor: [i, i]
                };
            var param2 = sessionService.retrieveSession(filename);
            expect(param2).toEqual(param1);
        }
    }));
    afterEach(function() {});
});