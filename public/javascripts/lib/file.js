define(function () {
    "use strict";
    var File = function (blob) {
        var file = blob,
            uploadSizes = 0;
        this.slice = file.slice || file.webkitSlice || file.mozSlice;
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
