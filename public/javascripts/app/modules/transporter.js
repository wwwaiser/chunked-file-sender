define(['config', 'lib/xhr2'], function (config, xhr) {
    "use strict";
    var _connectionsPool = {},
        _file,
        _listenIntervalID;

    var Connection = function (id) {
        var _id = id,
            _uploadedSize = 0,
            _chunkSize = config('chunkSize'),
            _totalSize = _file.getSize();

        var _isEndOfFile = function () {
            console.log(_uploadedSize + '===' + _totalSize);
            return _uploadedSize === _totalSize;
        };

        var _destroy = function () {
            jQuery.ajax({
                url: config('DESTROY_CONNECTION_URL') + '/' + _file.getId() + '/' + _id,
                type: 'POST',
                success: function () {
//                    delete _connectionsPool[_id];
                }
            });
        };

        var _send = function () {
            var fileChunk = _file.slice(_uploadedSize, _uploadedSize + _chunkSize);
            xhr({
                type: 'POST',
                url: config('SEND_CHUNK_URL') + '/' + _file.getId() + '/' + _id,
                data: fileChunk,
                onSuccess: function () {
                    if (_isEndOfFile()) {
                        _destroy();
                    } else {
                        _uploadedSize = _uploadedSize + fileChunk.size;
                        _send();
                    }
                }
            });
        };

        var _startTransfer = function () {
            _send();
        };

        _startTransfer();

        this.getId = function () {
            return _id;
        };
    };

    var _initConnections = function (data) {
        if (data.length) {
            data.forEach(function (connectionId) {
                if (_connectionsPool.hasOwnProperty(connectionId)) {
                    return;
                }
                _connectionsPool[connectionId] = new Connection(connectionId);
            });
        }
    };

    var _startListen = function () {
        _listenIntervalID = setInterval(function () {
            jQuery.ajax({
                url: '/get_connections/' + _file.getId(),
                type: 'POST',
                success: function (data) {
                    _initConnections(data);
                }
            });
        }, config('pingTime'));
    };

    var _generateFileLink = function () {
        return window.location.host + '/register_connection/' + _file.getId();
//        jQuery.emit('generatedFileLink', window.loation.domain + co)
    };

    var _registerFile = function () {
        jQuery.ajax({
            url: '/register_file/' + _file.getId() + '?' + jQuery.param({
                name: _file.getName(),
                size: _file.getSize(),
                type: _file.getType()
            }),
            type: 'POST',
            success: function (data) {
                if (data.success) {
                    console.log('file with id: ' + _file.getId() + ' rgtrd');
                    console.log(_generateFileLink());
                    _startListen();
                }
            }
        });
    };

    var _stopListen = function () {
        clearInterval(_listenIntervalID);
    };

    var _init = function (file) {
        _file = file;
        _registerFile();
    };

    return {
        init: _init,
        getConnectionsPool: function () {
            return _connectionsPool;
        },
        clearConnetionsPool: function () {
            _connectionsPool = {};
        },
        startListen: _startListen,
        stopListen: _stopListen
    };

});
