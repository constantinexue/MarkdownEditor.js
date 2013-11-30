var assert = require('assert'),
    url = require('url'),
    async = require('async'),
    _ = require('underscore'),
    request = require('request');

describe('REST API', function() {
    var BASE_URL = 'http://localhost:3000/api';
    it('Project', function(done) {
        var projectName = 'NewProject1',
            projectUrl = BASE_URL + '/' + projectName,
            articleSubject = 'NewMarkdown.md',
            articleUrl = projectUrl + '/' + articleSubject;
        async.series([
                // Creates a project
                function(callback) {
                    request.post(projectUrl, function(error, response, body) {
                        console.log(body);
                        callback();
                    });
                },
                // Creates an article
                function(callback) {
                    request.post(articleUrl, {
                        form: {
                            content: '# Heading1'
                        }
                    }, function(error, response, body) {
                        console.log(body);
                        console.log(_.isString(JSON.parse(body)))
                        callback();
                    });
                },
                // Deletes this article
                function(callback) {
                    request.del(articleUrl, function(error, response, body) {
                        callback();
                    });
                },
                // Deletes project and article
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