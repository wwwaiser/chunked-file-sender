define(['config', 'lib/xhr2'], function (config, xhr) {
    "use strict";
    var _connectionsPool = {},
        _file,
        _listenIntervalID;

    /**
     * Create Connection instance
     *
     * @constructor
     * @this {Connection}
     * @param {number} id Connection id
     */
    var Connection = function (id) {
        var _id = id,
            _uploadedSize = 0,
            _chunkSize = config('chunkSize'),
            _totalSize = _file.getSize();

        /**
         * Checking end of file
         *
         * @return {Boolean}
         * @private
         */
        var _isEndOfFile = function () {
            return _uploadedSize === _totalSize;
        };

        /**
         * destroy connection from connections pool on client and server side
         * @private
         */
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

        /**
         * Recursively send chunk of file to server while not end of file
         *
         * @private
         */
        var _send = function () {
            if (_isEndOfFile()) {
                jQuery.eventEmitter.emit('fileUploaded', {
                    connectionId: _id
                });
                _destroy();
                return;
            }
            var fileChunk = _file.slice(_uploadedSize, _uploadedSize + _chunkSize);
            xhr({
                type: 'POST',
                url: config('SEND_CHUNK_URL') + '/' + _file.getId() + '/' +
                    _id + '?chunk_size=' + fileChunk.size,
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

        jQuery.eventEmitter.emit('connectionCreated', {
            connectionId: _id,
            file: _file
        });
        _startTransfer();


        /**
         * Return connection id
         *
         * @return {String}
         */
        this.getId = function () {
            return _id;
        };
    };

    /**
     * Check connectionsPool for connection and create instance of Connection
     *
     * @param {Array} data
     * @private
     */
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

    /**
     * Generate unique link for file that was selected
     *
     * @return {String}
     * @private
     */
    var _generateFileLink = function () {
        var URL =  location.protocol + location.host + config('FILE_INFO_URL') + '/' + _file.getId();
        return URL;
    };

    return {
        /**
         * Register file for transferring
         *
         * @param {Object} file
         */
        registerFile: function (file) {
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
        },

        /**
         * Unregister file (Delete from the files array on server)
         *
         * @param {Number|String} fileId
         */
        unregisterFile: function (fileId) {
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
        },

        /**
         * Start listening for new client connection
         */
        startListen: function () {
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
        },

        /**
         * Stop listening for new client connection
         */
        stopListen: function () {
            clearInterval(_listenIntervalID);
        }
    };
});
