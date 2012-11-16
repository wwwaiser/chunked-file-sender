require([
    'lib/file',
    'modules/transporter',
    'config',
    'modules/fileInfo'
], function (File, transporter, config) {

    var _fileInput = jQuery(config('fileInput'));

    var _onFileSelect = function (e) {
        var file = new File(e.target.files[0]);
        jQuery.eventEmitter.emit('fileSelected', file);
        transporter.init(file);
    };

    var _initEvents = function () {
        _fileInput.change(_onFileSelect);
    };

    _initEvents();

});