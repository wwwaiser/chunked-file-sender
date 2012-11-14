define(function () {
    "use strict";
    var File = function (blob) {
        var file = blob,
            _slice = file.slice || file.webkitSlice || file.mozSlice;

        this.slice = function () {
            return _slice.apply(file, arguments);
        };

        this.getSize = function () {
            return file.size;
        };

        this.getType = function () {
            return file.type;
        };

        this.getBlob = function () {
            return blob;
        };
    };

    return File;
});
