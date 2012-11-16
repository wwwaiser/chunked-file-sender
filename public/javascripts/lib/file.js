define(function () {
    "use strict";
    var File = function (blob) {
        var _file = blob,
            _fileId = Math.random().toString(36).substring(7),
            _slice = _file.slice || _file.webkitSlice || _file.mozSlice;

        this.slice = function () {
            return _slice.apply(_file, arguments);
        };

        this.getSize = function () {
            return _file.size;
        };

        this.getType = function () {
            return _file.type;
        };

        this.getName = function () {
            return _file.name;
        };

        this.getBlob = function () {
            return blob;
        };

        this.getId = function () {
            return _fileId;
        };
    };

    return File;
});
