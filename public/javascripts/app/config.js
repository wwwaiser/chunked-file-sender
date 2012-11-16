define(function () {
    var config = {
        fileInput: 'input[type="file"]',
        chunkSize: 1024 * 100,
        pingTime: 3000,
        /*   URLS    */
        SEND_CHUNK_URL: '/send_chunk',
        DOWNLOAD_FILE_URL: '/download_file',
        REGISTER_FILE_URL: '/register_file',
        DESTROY_CONNECTION_URL: '/destroy_connection',
        GET_CONNECTIONS_URL: '/get_connections'
    };

    return function (key, value) {
        if (value) {
            config[key] = value;
            return;
        }
        return config[key];
    };
});