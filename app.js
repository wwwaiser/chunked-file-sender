
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use (function(req, res, next) {
        var data='';
        console.log('in use');
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
            console.log('recive data');
            data += chunk;
        });

        req.on('end', function() {
            req.body = data;
            next();
        });
    });
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/start_transfer', function (req, res) {
    console.log(req.body);
    console.log(req.files);
    res.send({
        connections: [
            {id: 'dsfgdhf'}
        ]
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
