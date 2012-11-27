define(function () {
    "use strict";
    /**
     * Wrapper for native XMLHTTPRequest for sending chunks
     *
     * @param {Object} params.data
     * @param {String} params.type
     * @param {String} params.url
     * @param {Function} params.onSuccess
     * @param {Function} params.onError
     */

    var xhr = function (params) {
        var xhr = jQuery.ajaxSettings.xhr();
        var response;
        xhr.open(params.type, params.url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    response = JSON.parse(xhr.responseText);
                    params.onSuccess(response.data);
                } else {
                    params.onError(response);
                }
            }
        };
        xhr.send(params.data);
    };
    return xhr;
});
