define(function () {
    "use strict";
    var xhr = function (params) {
        var xhr = jQuery.ajaxSettings.xhr();
        var response;
        xhr.open(params.type, params.url);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    response = JSON.parse(xhr.responseText);
                    if (response.success === true) {
                        params.onSuccess(response.data);
                    } else {
                        params.onError(response.message);
                    }
                } else {
                    params.onError(response);
                }
            }
        };
        xhr.send(params.data);
    };
    return xhr;
});
