define(function () {
    "use strict";
    var config = {
        fileInput: 'input[type="file"]',
        chunkSize: 1024 * 100,
        pingTime: 1000
    };

    return function (key, value) {
        if (value) {
            config[key] = value;
            return;
        }
        return config[key];
    };
});