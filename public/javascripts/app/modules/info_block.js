define(['config'], function (config) {
    var _infoBlock = jQuery('.info-block'),
        _progressBLock = jQuery('.progress-block ul'),
        _progressWidth = jQuery(config('PROGRESS_BLOCK')).width(),
        /*  CONSTANTS */
        MB = 'M',
        PX = 'px',
        DOT = '.',
        PERCENT = '%',
        NAME_BLOCK = '.name',
        SIZE_BLOCK = '.size',
        TYPE_BLOCK = '.type',
        RATIO_BLOCK = 'span.ratio',
        PERCENT_BLOCK = 'span.percent',
        URL_BLOCK = '.URL';

    var _renderFileInfo = function (data) {
        var file = data.file,
            URL = data.URL;

        _infoBlock.find(NAME_BLOCK).text(file.getName());
        _infoBlock.find(SIZE_BLOCK).text(_formatSize(file.getSize()) + ' ' + MB);
        _infoBlock.find(TYPE_BLOCK).text(file.getType());
        _infoBlock.find(URL_BLOCK).text(URL);
    };

    var _renderConnection = function (data) {
        var progressBar = jQuery(config('PROGRESS_BLOCK').supplant({
            fileName: data.file.getName()
        }));
        progressBar.addClass(data.connectionId);
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
//        console.log(data.ratio)
        var width = _progressWidth * data.ratio + PX,
            percent = Math.round(data.ratio * 100);
        jQuery(DOT + data.connectionId).find(RATIO_BLOCK).width(width);
        jQuery(DOT + data.connectionId).find(PERCENT_BLOCK).text(percent + PERCENT);
    });

    return;
});
