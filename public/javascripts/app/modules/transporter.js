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
            return _uploadedSize == _totalSize;
        };

        var _destroy = function () {
            jQuery.ajax({
                url: config('DESTROY_CONNECTION_URL') + '/' + _file.getId() + '/' + _id,
                type: 'POST',
                success: function () {
                    delete _connectionsPool[_id];
                    jQuery.eventEmitter.emit('connectionDestroyed', {
                        connectionId: _id
                    });
                }
            });
        };

        var _send = function () {
            if (_isEndOfFile()) {
                _destroy();
                jQuery.eventEmitter.emit('fileUploaded', {
                    connectionId: _id
                });
            }
            var fileChunk = _file.slice(_uploadedSize, _uploadedSize + _chunkSize);
            xhr({
                type: 'POST',
                url: config('SEND_CHUNK_URL') + '/' + _file.getId() + '/' + _id,
                data: fileChunk,
                onSuccess: function () {
                    _uploadedSize = _uploadedSize + fileChunk.size;
                    jQuery.eventEmitter.emit('chunkUploaded', {
                        connectionId: _id,
                        ratio: _uploadedSize / _totalSize
                    });
                    setTimeout(_send, config('sendInterval'));
                }
            });
        };

        var _startTransfer = function () {
            _send();
        };

        jQuery.eventEmitter.emit('connectionCreated', _id);
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
            if (!_file) {
                return;
            }
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
        var URL =  location.protocol + location.host + config('REGISTER_CONNECTION_URL') + '/' + _file.getId();
        return URL;
    };

    var _registerFile = function (file) {
        _file = file;
        jQuery.ajax({
            url: config('REGISTER_FILE_URL') + '/' + _file.getId() + '?' + jQuery.param({
                name: _file.getName(),
                size: _file.getSize(),
                type: _file.getType()
            }),
            type: 'POST',
            success: function (data) {
                if (data.success) {
                    jQuery.eventEmitter.emit('fileSelected', {
                        file: _file,
                        URL: _generateFileLink()
                    });
                }
            }
        });
    };

    var _unregisterFile = function (fileId) {
        jQuery.ajax({
            url: '/unregister_file/' + fileId + '?' + jQuery.param({
                id: fileId
            }),
            type: 'POST',
            success: function (data) {
                if (data.success) {
                    return;
                }
            }
        });
    };

    var _stopListen = function () {
        clearInterval(_listenIntervalID);
    };

    return {
        registerFile: _registerFile,
        unregisterFile: _unregisterFile,
        startListen: _startListen,
        stopListen: _stopListen,
        getConnectionsPool: function () {
            return _connectionsPool;
        },
        clearConnetionsPool: function () {
            _connectionsPool = {};
        }
    };

});
