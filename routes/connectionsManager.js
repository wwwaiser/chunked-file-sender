module.exports = (function () {
    var _files = {},
        success = {
            success: true,
            data: '',
            message: 'succesfully done'
        },
        empty = {
            success: false,
            data: '',
            message: 'no data for this query'
        };

    return {
        default: function (req, res) {
            res.render('index', {
                title: 'Share file'
            });
        },

        getConnectionsPool: function (req, res) {
            if (!_files[req.route.params.file_id]) {
                res.send(empty);
                return;
            }
            res.send(Object.keys(_files[req.route.params.file_id].connections));
        },

        registerFile: function (req, res) {
            var query = req.query;
            _files[req.route.params.file_id] = {
                name: query.name,
                type: query.type,
                size: query.size,
                connections: {}
            };

            res.send({
                success: true,
                data: ''
            });
        },

        unregisterFile: function (req, res) {
            delete _files[req.route.params.file_id];
            res.send(success);
        },

        registerConnection: function (req, res) {
            var params = req.route.params,
                connectionId = Math.random().toString(36).substring(7);

            if (!(_files[params.file_id])) {
                return;
            }
            res.writeHead(200, {
                'Content-Type': _files[params.file_id].type,
                'Content-Disposition': 'attachment; filename="' +  _files[params.file_id].name + '"',
                'Content-length': _files[params.file_id].size
            });
            _files[params.file_id].connections[connectionId] = {
                ip: req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                reciverResponse: res,
                senderResponse: {}
            };
        },

        unregisterConnection: function (req, res) {
            var params = req.route.params;
            _files[params.file_id].connections[params.connection_id].reciverResponse.end();
            delete _files[params.file_id].connections[params.connection_id];
            res.end();
        },

        fileInfo: function (req, res) {
            console.log(req.headers.host + req.url);
            var fileId = req.route.params.file_id,
                file = _files[fileId],
                protocol = req.connection.encrypted ? 'https' : 'http',
                params = {
                    name: file.name,
                    type: file.type,
                    size: (file.size / 1024 / 1024).toFixed(2) + 'M',
                    title: 'Download',
                    href: protocol + '://' + req.headers.host + '/register_connection/' + fileId
                };
            res.render('file_info', params);
        },

        transferChunk: function (req, res) {
            var params = req.route.params;
            //keep sender response for answering on event "drain"
            _files[params.file_id].connections[params.connection_id].senderResponse = res;
            var reciverResponse = _files[params.file_id].connections[params.connection_id].reciverResponse;
            if (!reciverResponse.drain) {
                reciverResponse.drain = true;
                reciverResponse.on('drain', function () {
                    _files[params.file_id].connections[params.connection_id].senderResponse.send({
                        success: true,
                        data: ''
                    });
                });
            }
            reciverResponse.write(req.chunk);
            delete req.chunk;
            return;
        }

    };
}());
