define(['config', 'lib/xhr2'], function (config, xhr) {
    "use strict";
    var _connectionsPool = {},
        _file,
        _listenIntervalID;

    var Connection = function (options) {
        var _id = options.id,
            _uploadedSize = 0,
            _chunkSize = config('chunkSize'),
            _totalSize = _file.getSize();

        var _isEndOfFile = function () {
            return _uploadedSize === _totalSize;
        };

        var _destroy = function () {
            console.log('destroy connection with id: ' + _id);
            delete _connectionsPool[_id];
        };

        var _send = function () {
            var fileChunk = _file.slice(_uploadedSize, _uploadedSize + _chunkSize);
            console.log(fileChunk.size);
            xhr({
                type: 'POST',
                url: '/start_transfer',
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
        if (data.connections) {
            data.connections.forEach(function (options) {
                if (_connectionsPool.hasOwnProperty(options.id)) {
                    return;
                }
                console.log('new connection with id' + options.id);
                _connectionsPool[options.id] = new Connection(options);
            });
        }
    };

    var _startListen = function () {
        _listenIntervalID = setTimeout(function () {
            jQuery.ajax({
                url: '/get_connections',
                type: 'POST',
                success: function (data) {
                    _initConnections(data);
                }
            });
        }, config('pingTime'));
    };

    var _stopListen = function () {
        clearInterval(_listenIntervalID);
    };

    var _init = function (file) {
        _file = file;
        _startListen();
    };

    return {
        init: _init,
        getConnectionsPool: function () {
            return _connectionsPool;
        },
        startListen: _startListen,
        stopListen: _stopListen
    };

});

