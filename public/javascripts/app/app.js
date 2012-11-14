require([
    'lib/file',
    'modules/transporter',
    'config',
    'modules/fileInfo'
], function (File, transporter, config) {
    "use strict";

    var _connectionLink,
        _fileInput = jQuery(config.fileInput);

    var _genereteConectionLink = function () {
        _connectionLink = Math.random().toString(36).substring(7);
        jQuery.eventEmitter.emit('linkGenerated', _connectionLink);
    };

    var _onFileSelect = function (e) {
        var file = new File(e.target.files[0]);
        jQuery.eventEmitter.emit('fileSelected', file);
        _genereteConectionLink();
        transporter.init(new File(e.target.files[0]));
    };

    var _initEvents = function () {
        _fileInput.change(_onFileSelect);
    };

    _initEvents();


});