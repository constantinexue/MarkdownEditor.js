var fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    request = require('request'),
    async = require('async');

function pullAceLibs() {
    var lines = fs.readFileSync('ace.list', 'utf8').split('\n'),
        tasks = [],
        results = [];
    fse.removeSync('../public/js/ace');
    fs.mkdirSync('../public/js/ace');
    async.eachSeries(lines, function(line, callback) {
        var index = line.lastIndexOf('/'),
            url = line,
            filename = path.join(__dirname, '../public/js/ace', path.basename(line));
        request(url, function(err, response, body) {
            fs.writeFileSync(filename, body, 'utf8');
            callback();
        });
    }, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('finished');
        }
    });
}

pullAceLibs();