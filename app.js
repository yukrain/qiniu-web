var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var compression = require('compression');

var template = require('art-template');
template.config('base', '');
template.config('extname', '.html');
template.config('cache', false);

template.helper('json2str', function (json, format) {
    return  JSON.stringify(json);
});

var routes = require('./routes/index');

var config = require('./config');
var favicon = require('static-favicon');
var moment = require('moment');
moment.locale('zh-cn', {
    relativeTime : {
        future: "%s后",
        past:   "%s前",
        s:  "%d秒",
        m:  "1分钟",
        mm: "%d分钟",
        h:  "1小时",
        hh: "%d小时",
        d:  "1天",
        dd: "%d天",
        M:  "1月",
        MM: "%d月",
        y:  "1年",
        yy: "%d年"
    }
});

var app = express();
app.use(favicon(__dirname + '/public/favicon.png'));

template.config('base', '');
template.config('extname', '.html');
template.config('cache', false);

app.engine('.html', template.__express);
app.set('view engine', 'html');

app.use(compression({}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
//app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));

app.use( function(req,res,next){
    res.locals.debug = process.env.NODE_ENV !== 'production';
    next();
});

app.use('/', routes);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(config.port,function(){
    console.log(' Listening On Port',config.port);
});
module.exports = app;
