var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    when = require('when'),
    Converter = require('./converter');

module.exports = function() {
    var app = express();
    app.get('/', function(req, res) {
        var converter = new Converter(),
            mdFilename = req.query.file;
        if (mdFilename && fs.existsSync(mdFilename)) {
            var deferred = when.defer();
            when(mdFilename, function() {
                fs.readFile(mdFilename, 'utf8', function(err, data) {
                    if (err) {
                        console.log(err);
                        deferred.reject(500);
                    } else {
                        deferred.resolve(data);
                    }
                });
                return deferred.promise;
            }).then(function(data) {
                return converter.convert(data);
            }).then(function(result) {
                res.send(result);
            }, function(reason) {
                res.send(reason);
            });
        } else {
            res.send(404);
        }
    });
    try {
        app.listen(1983);
    } catch (err) {
        console.log(err);
    }
}