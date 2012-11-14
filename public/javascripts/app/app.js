require(['lib/file', 'modules/transporter', 'modules/fileInfo'], function (File, transporter) {
    "use strict";
    var options = {
        fileInput: 'input[type="file"]',
        chunkSize: 1024
    };

    var conectionLink,
        fileInput = jQuery(options.fileInput);


    var _onFileSelect = function (e) {
        var file = new File(e.target.files[0]);
        $.eventEmitter.emit('fileSelected', file);
        _genereteConectionLink();
        transporter.init(e.target.files[0]);
    };

    var _genereteConectionLink = function () {
        conectionLink = Math.random().toString(36).substring(7);
    };

    var _initEvents = function () {
        fileInput.change(_onFileSelect);
    };

    _initEvents();


});