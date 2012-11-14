define(['config'], function (config) {
    "use strict";
    var _connectionsPool = {},
        _file,
        _listenIntervalID;

    var _startListen = function () {
        _listenIntervalID = setInterval(function () {
            jQuery.ajax({
                url: '/get_connections',
                type: 'POST',
                success: function (data) {
                    _initConnection(data);
                }
            });
        }, config('pingTime'));
    };

    var _stopListen = function () {
        clearInterval(_listenIntervalID);
    };

    var _initConnection = function (data) {
        if (data.connections) {
            data.connections.forEach(function (connectionOptions) {
                if (_connectionsPool.hasOwnProperty(connectionOptions.id)) {
                    return;
                }
                console.log('new connection with id' + connectionOptions.id);
                _connectionsPool[connectionOptions.id] = new Connection(connectionOptions);
            });
        }
    };

    var Connection = function (file) {
        var _id = 0,
            _uploadedSize = 0,
            _totalSize = file.size;

        var _clearSelf = function () {
            delete _connectionsPool[_id];
        };

        var _send = function () {
            console.log(jQuery.ajaxSettings.xhr());
            var xhr = jQuery.ajaxSettings.xhr();

            xhr.open('POST', '/start_transfer');
            xhr.send(file);

//            if (_uploadedSize < _totalSize) {
//                jQuery.ajax({
//                    url: '/start_transfer',
//                    type: 'POST',
//                    data: 'file'
////                    processData: false,
////                        id: _id,
////                        totalSize: _totalSize,
////                        fileChunk: 'sadasdasdsd'
//////                        fileChunk: _file.slice(_uploadedSize, config('chunkSize'))
////                    },
////                    success: _send
//                });
//            }
        };

        this.getId = function () {
            return _id;
        };

        this.startTransfer = function () {
            _send();
        };

        this.startTransfer();

    };

    var _init = function (file) {
        _file = file;
        var connection = new Connection(file);
//        _startListen();
    };

    return {
        init: _init
    };

});
