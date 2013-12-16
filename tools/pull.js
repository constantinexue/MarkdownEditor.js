var fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    request = require('request'),
    when = require('when'),
    pipeline = require('when/pipeline'),
    parallel = require('when/parallel'),
    rest = require('rest'),
    async = require('async');

function Puller(url, filename) {
    var url = url,
        filename = filename;
    this.pull = function() {
        //var deferred = when.defer();
        // request(url, function(err, response, body) {
        //     console.log(filename);
        //     fs.writeFileSync(filename, body);
        //     return deferred.resolve();
        // });
        //return deferred.promise;
    };
}

function pullAceLibs() {
    var lines = fs.readFileSync('ace.list', 'utf8').split('\n'),
        tasks = [],
        results = [];
    fse.removeSync('../public/js/ace');
    fs.mkdirSync('../public/js/ace');
    async.eachSeries(lines, function(line, callback) {
        var index = line.lastIndexOf('/'),
            url = line,
            filename = path.join(__dirname, '../public/js/ace', path.basename(line)),
            puller = new Puller(line, filename);
        request(url, function(err, response, body) {
            results.push({
                filename: filename,
                content: body
            });
            callback();
        });
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(results.length);
            async.eachSeries(results, function(result, callback) {
                //console.log(typeof result.content);
                fs.writeFileSync(result.filename, result.content, 'utf8');
                callback();
            }, function(err) {
                if (err) console.log(err);
            });
        }
    });
}

pullAceLibs();