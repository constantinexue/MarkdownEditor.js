var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    marked = require('marked'),
    dust = require('dustjs-linkedin'),
    cons = require('consolidate');
var app = express();
app.configure(function() {
    app.use(express.favicon());
    app.use(function(req, res, next) {
        if (req.is('text/*')) {
            req.text = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                req.text += chunk;
            });
            req.on('end', next);
        } else {
            next();
        }
    });
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler());
    app.engine('dust', cons.dust);
    app.set('view engine', 'dust');
    app.set('views', path.join(__dirname, './views'));
    app.use('/public', express.static(path.join(__dirname, '../public')));
});
app.configure('development', function() {
    app.locals.nodeEnv = 'development';
    app.use(express.logger('dev'));
    app.locals.pretty = true;
    // app.use(require('less-middleware')({
    //     src: __dirname + '/public'
    // }));
});
app.configure('production', function() {
    app.locals.nodeEnv = 'production';
});

require('./controllers')(app);

app.listen(3000);