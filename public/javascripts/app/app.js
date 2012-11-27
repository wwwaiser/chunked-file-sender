require([
    'lib/file',
    'modules/transporter',
    'config',
    'modules/info_block'
], function (File, transporter, config) {
    "use strict";
    var _fileInput = jQuery(config('fileInput')),
        _infoBlock = jQuery('.info-block'),
        _fileUrl = jQuery("input[type=text]"),
        _file;


    var _onFileSelect = function (e) {
        if (_file) {
            transporter.unregisterFile(_file.getId());
        }

        _file = new File(e.target.files[0]);
        transporter.registerFile(_file);
        _infoBlock.show(500, function () {
            _fileUrl.click();
        });
    };

    var _initEvents = function () {
        _fileInput.change(_onFileSelect);
        _fileUrl.click(function () {
            this.select();
        });
    };

    _initEvents();
    transporter.startListen();

});