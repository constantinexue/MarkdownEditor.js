var fs = require('fs'),
    path = require('path'),
    request = require('request');

function pullAceLibs() {
    var lines = fs.readFileSync('ace.list', 'utf-8').split('\n');
    lines.forEach(function(line) {
        var index = line.lastIndexOf('/'),
            filename = path.join('../public/js/ace', path.basename(line));
        //console.log(index);
        console.log(filename);
        // request.get(line, function(error, response, body) {
        //     callback();
        // });
    });
}

pullAceLibs();