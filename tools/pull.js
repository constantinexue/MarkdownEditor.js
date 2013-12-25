var fs = require('fs'),
    fse = require('fs-extra'),
    path = require('path'),
    http = require('http-get'),
    when = require('when'),
    parallel = require('when/parallel'),
    _ = require('underscore');


function getFileUrls(listFile) {
    var fileUrls = fs.readFileSync(listFile, 'utf8').split('\n');
    return when.resolve(fileUrls);
}

function download(fileUrls, dir) {
    fse.removeSync(dir);
    fs.mkdirSync(dir);
    var tasks = [];
    fileUrls.forEach(function(fileUrl) {
        tasks.push(function() {
            var deferred = when.defer(),
                fileName = path.join(dir, path.basename(fileUrl));

            //console.log(path.basename(fileUrl));
            http.get(fileUrl, fileName, function(err, result) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(true);
                }
            });
            return deferred.promise;
        });
    });
    return parallel(tasks);
}

function pull(name) {
    var listFile = path.join(__dirname, name + '.list'),
        dir = path.join(__dirname, '../src/vendor', name);
    return getFileUrls(listFile)
        .then(function(fileUrls) {
            return download(fileUrls, dir);
        })
        .then(function() {
            console.log('Finished: ' + name);
            return when.resolve();
        });
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


fs.readdirSync(__dirname).forEach(function(filename){
    var ext = path.extname(filename);
    if (ext === '.list') {
        pull(path.basename(filename, '.list'));        
    }
});