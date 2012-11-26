define(function () {
    "use strict";
    var config = {
        fileInput: 'input[type="file"]',
        chunkSize: 1024 * 100,
        sendInterval: 1000,
        pingTime: 3000,
        /*   URLS    */
        SEND_CHUNK_URL: '/send_chunk',
        DOWNLOAD_FILE_URL: '/download_file',
        REGISTER_FILE_URL: '/register_file',
        REGISTER_CONNECTION_URL: '/register_connection',
        DESTROY_CONNECTION_URL: '/destroy_connection',
        GET_CONNECTIONS_URL: '/get_connections',
        /*   TEMPLATES  */
        PROGRESS_BLOCK: '<li class="progress"><span></span>0 %</li>'
    };

    return function (key, value) {
        if (value) {
            config[key] = value;
            return config[key];
        }
        return config[key];
    };
});