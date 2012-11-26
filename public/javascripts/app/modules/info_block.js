define(['config'], function (config) {
    var _infoBlock = jQuery('.info-block'),
        _progressBLock = jQuery('.progress-block ul'),
        /*  CONSTANTS */
        MB = 'M',
        NAME_BLOCK = '.name',
        SIZE_BLOCK = '.size',
        TYPE_BLOCK = '.type',
        URL_BLOCK = '.URL';

    var _renderFileInfo = function (data) {
        var file = data.file,
            URL = data.URL;

        _infoBlock.find(NAME_BLOCK).text(file.getName());
        _infoBlock.find(SIZE_BLOCK).text(file.getType());
        _infoBlock.find(TYPE_BLOCK).text(_formatSize(file.getSize()) + ' ' + MB);
        _infoBlock.find(URL_BLOCK).text(URL);
    };

    var _renderConnection = function (connectionId) {
        var progressBar = jQuery(config('PROGRESS_BLOCK'));

        progressBar.addClass(connectionId);
        _progressBLock.append(progressBar);
    };

    var _formatSize = function (size) {
        return (size / 1024 / 1024).toFixed(2);
    };

    jQuery.eventEmitter.on('fileSelected', function (e, file) {
        _renderFileInfo(file);
    });

    jQuery.eventEmitter.on('connectionCreated', function (e, data) {
        _renderConnection(data);
    });

    jQuery.eventEmitter.on('chunkUploaded', function (e, data) {

    });

    return;
});
