var assert = require('assert'),
    url = require('url'),
    async = require('async'),
    request = require('request');

describe('REST API', function() {
    var BASE_URL = 'http://localhost:3000/api';
    it('Project', function(done) {
        var projectName = 'NewProject1',
            projectUrl = BASE_URL + '/' + projectName;
        async.series([

                function(callback) {
                    request.post(projectUrl, function(error, response, body) {
                        console.log(body);
                        callback();
                    });
                },
                function(callback) {
                    request.del(projectUrl, function(error, response, body) {
                        callback();
                    });
                }
            ],
            function(err) {
                done();
            }
        );
    });
});