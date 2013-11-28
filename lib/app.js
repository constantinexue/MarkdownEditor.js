var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    marked = require('marked');
var app = express();
app.configure(function() {
    app.use(express.favicon());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler());
    app.set('views', path.join(__dirname, '../jade'));
    app.set('view engine', 'jade');
    app.use(express.static(path.join(__dirname, '../static')));
});
app.configure('development', function() {
    app.locals.nodeEnv = 'development';
    app.use(express.logger('dev'));
    app.locals.pretty = true;
    app.use(express.static(path.join(__dirname, '../assets')));
});
app.configure('production', function() {
    app.locals.nodeEnv = 'production';
});

require('./controllers')(app);


// app.get('/articles/:title', function(req, res) {
//     var filename = path.join(__dirname, 'data', req.params.title + '.md');
//     fs.readFile(filename, 'utf8', function(err, data) {
//         if (err) throw err;
//         marked(data, function(err, html) {
//             if (err) throw err;
//             res.render('article', {
//                 content: html
//             });
//         });
//     });
// });

app.listen(3000);