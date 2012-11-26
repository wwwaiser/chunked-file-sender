define(function () {
    "use strict";
    //microteplating
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
    };

    var config = {
        fileInput: 'input[type="file"]',
        chunkSize: 1024 * 1000,
        sendInterval: 1000,
        pingTime: 3000,
        /*   URLS    */
        SEND_CHUNK_URL: '/send_chunk',
        REGISTER_FILE_URL: '/register_file',
        FILE_INFO_URL: '/file_info',
        DESTROY_CONNECTION_URL: '/destroy_connection',
        GET_CONNECTIONS_URL: '/get_connections',
        /*   TEMPLATES  */
        PROGRESS_BLOCK: '<li title="{fileName}" class="progress"><span class="ratio"></span><span class="percent">0 %</span></li>'
    };

    return function (key, value) {
        if (value) {
            config[key] = value;
            return config[key];
        }
        return config[key];
    };
});