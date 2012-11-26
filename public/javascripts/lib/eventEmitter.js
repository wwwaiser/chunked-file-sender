(function (jQuery) {
    "use strict";
    jQuery.eventEmitter = {
        _JQInit: function () {
            this._JQ = jQuery(this);
        },
        emit: function (evt, data) {
            !this._JQ && this._JQInit();
            console.log(evt)
            this._JQ.trigger(evt, data);
        },
        once: function (evt, handler) {
            !this._JQ && this._JQInit();
            this._JQ.one(evt, handler);
        },
        on: function (evt, handler) {
            !this._JQ && this._JQInit();
            this._JQ.bind(evt, handler);
        },
        off: function (evt, handler) {
            !this._JQ && this._JQInit();
            this._JQ.unbind(evt, handler);
        }
    };

}(jQuery));

