var request = require('request'),
    fs = require('fs'),
    http = require('http-get');

describe('REST API', function() {
    it('Project', function(done) {
        var url = 'http://www.openstack.org/themes/openstack/images/openstack-software-diagram.png';
        //var url = 'http://www.zgche.com/data/carimages/9187-1.jpg';
        request.post(url, function(error, response, body) {
            //var base64 = new Buffer(response.body).toString();//'base64'
            //console.log(base64);
            fs.writeFileSync('test.png', new Buffer(body, 'binary'));
            done();
        });
        // var options = {
        //     url: url,
        //     bufferType: "buffer"
        // };
        // http.get(options, function(error, result) {
        //     //var base64 = result.buffer.toString('base64');
        //     fs.writeFileSync('test.png', new Buffer(result.buffer, 'binary'));
        //     // console.log(new Buffer("Hello World").toString('base64'));
        //     // console.log(new Buffer("SGVsbG8gV29ybGQ=", 'base64').toString('ascii'));
        //     done();
        // });
    });
});