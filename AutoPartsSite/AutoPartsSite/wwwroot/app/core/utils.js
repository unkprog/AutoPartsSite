define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.urlEncode = exports.nativeBridge = exports.strToHashCode = exports.numberRound = exports.numberPadZero = exports.numberToString = exports.date_from_ddmmyyyy = exports.date_ddmmyyyy_withtime = exports.date_ddmmyyyy = exports.date_parse = exports.dateToday = exports.dateToLongString = exports.stringFormat = exports.validatePhone = exports.validateEmail = exports.isNullOrEmpty = exports.isNull = exports.destroyBlurEvent = exports.createBlurEvent = exports.destroyContextMenuEvent = exports.createContextMenuEvent = exports.destroyDblTouchClickEvent = exports.createDblTouchClickEvent = exports.destroyTouchClickEvent = exports.createTouchClickEvent = exports.destroyClickEvent = exports.createClickEvent = exports.destroyEventListener = exports.createEventListener = void 0;
    function createEventListener(elemName, eventName, clickFunc, thisObject, view) {
        var result = $.proxy(clickFunc, thisObject);
        var elem = elemName instanceof $ ? elemName : (view ? view.find("#" + elemName) : $("#" + elemName));
        for (var i = 0, iCount = elem.length; i < iCount; i++)
            elem[i].addEventListener(eventName, result, false);
        return result;
    }
    exports.createEventListener = createEventListener;
    function destroyEventListener(elemName, eventName, proxyFunc, view) {
        var elem = elemName instanceof $ ? elemName : (view ? view.find("#" + elemName) : $("#" + elemName));
        for (var i = 0, iCount = elem.length; i < iCount; i++)
            elem[i].removeEventListener(eventName, proxyFunc);
    }
    exports.destroyEventListener = destroyEventListener;
    function createClickEvent(elemName, clickFunc, thisObject, view) {
        return createEventListener(elemName, "click", clickFunc, thisObject, view);
    }
    exports.createClickEvent = createClickEvent;
    function destroyClickEvent(elemName, proxyFunc, view) {
        return destroyEventListener(elemName, "click", proxyFunc, view);
    }
    exports.destroyClickEvent = destroyClickEvent;
    function createTouchClickEvent(elemName, clickFunc, thisObject, view) {
        return createEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "click", clickFunc, thisObject, view);
    }
    exports.createTouchClickEvent = createTouchClickEvent;
    function destroyTouchClickEvent(elemName, proxyFunc, view) {
        return destroyEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "click", proxyFunc, view);
    }
    exports.destroyTouchClickEvent = destroyTouchClickEvent;
    function createDblTouchClickEvent(elemName, clickFunc, thisObject, view) {
        return createEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "dblclick", clickFunc, thisObject, view);
    }
    exports.createDblTouchClickEvent = createDblTouchClickEvent;
    function destroyDblTouchClickEvent(elemName, proxyFunc, view) {
        return destroyEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "dblclick", proxyFunc, view);
    }
    exports.destroyDblTouchClickEvent = destroyDblTouchClickEvent;
    function createContextMenuEvent(elemName, clickFunc, thisObject, view) {
        return createEventListener(elemName, "contextmenu", clickFunc, thisObject, view);
    }
    exports.createContextMenuEvent = createContextMenuEvent;
    function destroyContextMenuEvent(elemName, proxyFunc, view) {
        return destroyEventListener(elemName, "contextmenu", proxyFunc, view);
    }
    exports.destroyContextMenuEvent = destroyContextMenuEvent;
    function createBlurEvent(elemName, clickFunc, thisObject, view) {
        return createEventListener(elemName, "blur", clickFunc, thisObject, view);
    }
    exports.createBlurEvent = createBlurEvent;
    function destroyBlurEvent(elemName, proxyFunc, view) {
        return destroyEventListener(elemName, "blur", proxyFunc, view);
    }
    exports.destroyBlurEvent = destroyBlurEvent;
    function isNull(value) {
        return (value === null || value === undefined);
    }
    exports.isNull = isNull;
    function isNullOrEmpty(value) {
        return (value === null || value === undefined || value === '');
    }
    exports.isNullOrEmpty = isNullOrEmpty;
    function validateEmail(email) {
        if (!email)
            return false;
        var pattern = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i;
        return pattern.test(email);
    }
    exports.validateEmail = validateEmail;
    function validatePhone(phone) {
        if (!phone)
            return false;
        var pattern = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
        return pattern.test(phone);
    }
    exports.validatePhone = validatePhone;
    function stringFormat() {
        var args1 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args1[_i] = arguments[_i];
        }
        var args = Array.prototype.slice.call(arguments, 1);
        return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
            return args[index];
        });
    }
    exports.stringFormat = stringFormat;
    ;
    function dateToLongString(date) {
        return date.toLocaleString();
    }
    exports.dateToLongString = dateToLongString;
    function dateToday() {
        var result = new Date();
        result.setHours(0, 0, 0, 0);
        return result;
    }
    exports.dateToday = dateToday;
    function date_parse(date) {
        var result;
        var split1 = date.split(date.indexOf(' ') > -1 ? ' ' : 'T');
        var splitDate = (split1.length > 0 ? split1[0].split('.') : []);
        var splitTime = (split1.length > 1 ? split1[1].split(':') : []);
        result = new Date(parseInt(splitDate[2], 10), parseInt(splitDate[1], 10) - 1, parseInt(splitDate[0], 10), splitTime.length > 0 ? parseInt(splitTime[0], 10) : 0, splitTime.length > 1 ? parseInt(splitTime[1], 10) : 0, splitTime.length > 2 ? parseInt(splitTime[2], 10) : 0);
        return result;
    }
    exports.date_parse = date_parse;
    window.date_parse = date_parse;
    function date_ddmmyyyy(date) {
        var _date = (date ? (typeof date === 'string' || date instanceof String ? date_parse(date) : date) : new Date());
        var yyyy = _date.getFullYear().toString();
        var mm = (_date.getMonth() + 1).toString();
        var dd = _date.getDate().toString();
        return (dd[1] ? dd : '0' + dd[0]) + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + yyyy;
    }
    exports.date_ddmmyyyy = date_ddmmyyyy;
    ;
    window.date_ddmmyyyy = date_ddmmyyyy;
    function date_ddmmyyyy_withtime(date) {
        var _date = (date ? (typeof date === 'string' || date instanceof String ? new Date(date) : date) : new Date());
        var yyyy = _date.getFullYear().toString();
        var mm = (_date.getMonth() + 1).toString();
        var dd = _date.getDate().toString();
        var hh = _date.getHours().toString();
        var mn = _date.getMinutes().toString();
        var ss = _date.getSeconds().toString();
        return (dd[1] ? dd : '0' + dd[0]) + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + yyyy + ' ' + (hh[1] ? hh : '0' + hh[0]) + ':' + (mn[1] ? mn : '0' + mn[0]) + ':' + (ss[1] ? ss : '0' + ss[0]);
    }
    exports.date_ddmmyyyy_withtime = date_ddmmyyyy_withtime;
    ;
    window.date_ddmmyyyy_withtime = date_ddmmyyyy_withtime;
    function date_from_ddmmyyyy(dateStr) {
        var parts = dateStr.split(".");
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), 0, 0, 0, 0);
    }
    exports.date_from_ddmmyyyy = date_from_ddmmyyyy;
    ;
    window.date_from_ddmmyyyy = date_from_ddmmyyyy;
    function numberToString(value, decimal) {
        var result = "";
        if (!decimal)
            decimal = 0;
        if (value || value === 0) {
            if (value === 0)
                result = '-';
            else
                result = value.toFixed(decimal);
        }
        return result;
    }
    exports.numberToString = numberToString;
    window.numberToString = numberToString;
    function numberPadZero(value, length) {
        var str = '' + value;
        while (str.length < length)
            str = '0' + str;
        return str;
    }
    exports.numberPadZero = numberPadZero;
    window.numberPadZero = numberPadZero;
    function numberRound(value, places) {
        var multiplier = Math.pow(10, places);
        return (Math.round(value * multiplier) / multiplier);
    }
    exports.numberRound = numberRound;
    window.numberRound = numberRound;
    function strToHashCode(value) {
        var hash = 0;
        if (value && value.length !== 0) {
            if (Array.prototype.reduce) {
                hash = value.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
            }
            else {
                for (var i = 0, icount = value.length; i < icount; i++) {
                    var character = value.charCodeAt(i);
                    hash = ((hash << 5) - hash) + character;
                    hash = hash & hash;
                }
            }
        }
        return hash;
    }
    exports.strToHashCode = strToHashCode;
    window.strToHashCode = strToHashCode;
    function urlEncode(text) {
        var encoded = '';
        for (var _i = 0, text_1 = text; _i < text_1.length; _i++) {
            var char = text_1[_i];
            encoded += '%' + char.charCodeAt(0).toString(16);
        }
        return encoded;
    }
    exports.urlEncode = urlEncode;
    window.urlEncode = urlEncode;
});
//# sourceMappingURL=utils.js.map