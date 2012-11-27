
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , manager = require('./routes/connectionsManager')
  , path = require('path');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(function (req, res, next) {
        if (!req.query.chunk_size) {
            next();
            return;
        }
        console.log(req.query.chunk_size);
        var buf = new Buffer(+req.query.chunk_size);
        var offset = 0;

        req.on('data', function (chunk) {
            chunk.copy(buf, offset);
            offset += chunk.length;
        });

        req.on('end', function () {
            req.chunk = buf;
            next();
        });

        req.on('close', function (err) {
            console.log('conection was clothed!');
        });

    });
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});



app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', manager.default);

app.post('/register_file/:file_id', manager.registerFile);

app.post('/unregister_file/:file_id', manager.unregisterFile);

app.post('/send_chunk/:file_id/:connection_id', manager.transferChunk);

app.post('/get_connections/:file_id', manager.getConnectionsPool);

app.get('/register_connection/:file_id', manager.registerConnection);

app.get('/file_info/:file_id', manager.fileInfo);

app.post('/destroy_connection/:file_id/:connection_id', manager.unregisterConnection);



http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
