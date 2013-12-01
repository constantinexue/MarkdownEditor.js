var assert = require('assert'),
    url = require('url'),
    async = require('async'),
    _ = require('underscore'),
    request = require('request');

describe('REST API', function() {
    var BASE_URL = 'http://localhost:3000/api';
    it('Project', function(done) {
        var collectionName = 'MyCollection',
            collectionUrl = BASE_URL + '/' + collectionName,
            articleSubject = 'ANewArticle',
            articleUrl = collectionUrl + '/' + articleSubject;
        async.series([
                // Creates a project
                function(callback) {
                    request.post(collectionUrl, function(error, response, body) {
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
                    request.del(collectionUrl, function(error, response, body) {
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