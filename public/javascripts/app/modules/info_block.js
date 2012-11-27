define(['config'], function (config) {
    "use strict";
    var _infoBlock = jQuery('.info-block'),
        _progressWrap = jQuery('.progress-block ul'),
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
        URL_BLOCK = '.url';


    /**
     * Helper for microtemplating
     *
     * @param {String} text
     * @param {Object} params
     * @private
     * @return {String}
     */
    var _supplant = function (text, params) {
        return text.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = params[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
    };

    /**
     * Render information about selected file
     *
     * @param {Object} data.file
     * @param {String} data.URL
     * @private
     */
    var _renderFileInfo = function (data) {
        var file = data.file,
            URL = data.URL;
        _infoBlock.find(NAME_BLOCK).text(file.getName());
        _infoBlock.find(SIZE_BLOCK).text(_formatSize(file.getSize()) + ' ' + MB);
        _infoBlock.find(TYPE_BLOCK).text(file.getType());
        _infoBlock.find(URL_BLOCK).val(URL);
    };

    var _renderConnection = function (data) {
        var progressBar = jQuery(_supplant(config('PROGRESS_BLOCK'), {
            fileName: data.file.getName()
        }));

        progressBar.addClass(data.connectionId);
        _progressWrap.append(progressBar);
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
        var width = _progressWidth * data.ratio + PX,
            percent = Math.round(data.ratio * 100);
        jQuery(DOT + data.connectionId).find(RATIO_BLOCK).width(width);
        jQuery(DOT + data.connectionId).find(PERCENT_BLOCK).text(percent + PERCENT);
    });

    return;
});
