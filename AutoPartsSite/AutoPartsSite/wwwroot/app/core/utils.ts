export function createEventListener(elemName: string | JQuery, eventName: string, clickFunc: any, thisObject: any, view?: JQuery): any {
    var result = $.proxy(clickFunc, thisObject);
    var elem: JQuery = elemName instanceof $ ? <JQuery>elemName : (view ? view.find("#" + elemName) : $("#" + elemName));
    for (let i = 0, iCount = elem.length; i < iCount; i++)
        elem[i].addEventListener(eventName, result, false);
    return result;
}

export function destroyEventListener(elemName: string | JQuery, eventName: string, proxyFunc: any, view?: JQuery): any {
    let elem: JQuery = elemName instanceof $ ? <JQuery>elemName : (view ? view.find("#" + elemName) : $("#" + elemName));
    for (let i = 0, iCount = elem.length; i < iCount; i++)
        elem[i].removeEventListener(eventName, proxyFunc);
}

export function createClickEvent(elemName: string | JQuery, clickFunc: any, thisObject: any, view?: JQuery): any {
    return createEventListener(elemName, "click", clickFunc, thisObject, view);
}

export function destroyClickEvent(elemName: string | JQuery, proxyFunc: any, view?: JQuery): any {
    return destroyEventListener(elemName, "click", proxyFunc, view);
}

export function createTouchClickEvent(elemName: string | JQuery, clickFunc: any, thisObject: any, view?: JQuery): any {
    return createEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "click", clickFunc, thisObject, view);
}

export function destroyTouchClickEvent(elemName: string | JQuery, proxyFunc: any, view?: JQuery): any {
    return destroyEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "click", proxyFunc, view);
}

export function createDblTouchClickEvent(elemName: string | JQuery, clickFunc: any, thisObject: any, view?: JQuery): any {
    return createEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "dblclick", clickFunc, thisObject, view);
}

export function destroyDblTouchClickEvent(elemName: string | JQuery, proxyFunc: any, view?: JQuery): any {
    return destroyEventListener(elemName, ("ontouchstart" in window) ? "touchend" : "dblclick", proxyFunc, view);
}

export function createContextMenuEvent(elemName: string | JQuery, clickFunc: any, thisObject: any, view?: JQuery): any {
    return createEventListener(elemName, "contextmenu", clickFunc, thisObject, view);
}

export function destroyContextMenuEvent(elemName: string | JQuery, proxyFunc: any, view?: JQuery): any {
    return destroyEventListener(elemName, "contextmenu", proxyFunc, view);
}

export function createBlurEvent(elemName: string | JQuery, clickFunc: any, thisObject: any, view?: JQuery): any {
    return createEventListener(elemName, "blur", clickFunc, thisObject, view);
}

export function destroyBlurEvent(elemName: string | JQuery, proxyFunc: any, view?: JQuery): any {
    return destroyEventListener(elemName, "blur", proxyFunc, view);
}

export function isNullOrEmpty(value: string): boolean {
    return (value === null || value === undefined || value === '');
}

export function validateEmail(email: string): boolean {
    if (!email) return false;
    var pattern = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/i;
    return pattern.test(email);
}

export function validatePhone(phone: string): boolean {
    if (!phone) return false;
    var pattern = new RegExp(/^\+?1?\s*?\(?\d{3}(?:\)|[-|\s])?\s*?\d{3}[-|\s]?\d{4}$/);
    return pattern.test(phone);
}

export function stringFormat(...args1: any[]): string {
    var args = Array.prototype.slice.call(arguments, 1);
    return arguments[0].replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
};


export function dateToLongString(date: Date): string {
    return date.toLocaleString();
}

export function dateToday(): Date {
    let result: Date = new Date();
    result.setHours(0, 0, 0, 0);
    return result;
}

export function date_parse(date: string): Date {
    let result: Date; // = new Date();
    let split1: Array<string> = date.split(' ');
    let splitDate: Array<string> = (split1.length > 0 ? split1[0].split('.') : []);
    let splitTime: Array<string> = (split1.length > 1 ? split1[1].split(':') : []);

    result = new Date(parseInt(splitDate[2], 10), parseInt(splitDate[1], 10) - 1, parseInt(splitDate[0], 10)
        , splitTime.length > 0 ? parseInt(splitTime[0], 10) : 0, splitTime.length > 1 ? parseInt(splitTime[1], 10) : 0, splitTime.length > 2 ? parseInt(splitTime[2], 10) : 0);

    return result;
}
window.date_parse = date_parse;

export function date_ddmmyyyy(date: Date | string): string {
    let _date: Date = (date ? (typeof date === 'string' || date instanceof String ? date_parse(date as string) : date) : new Date());
    var yyyy = _date.getFullYear().toString();
    var mm = (_date.getMonth() + 1).toString(); // getMonth() is zero-based         
    var dd = _date.getDate().toString();

    return (dd[1] ? dd : '0' + dd[0]) + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + yyyy;
};
window.date_ddmmyyyy = date_ddmmyyyy;

export function date_ddmmyyyy_withtime(date: Date | string): string {
    let _date: Date = (date ? (typeof date === 'string' || date instanceof String ? new Date(date as string) : date) : new Date());
    let yyyy:string = _date.getFullYear().toString();
    let mm: string = (_date.getMonth() + 1).toString(); // getMonth() is zero-based         
    let dd: string = _date.getDate().toString();
    let hh: string = _date.getHours().toString();
    let mn: string = _date.getMinutes().toString();
    let ss: string = _date.getSeconds().toString();

    return (dd[1] ? dd : '0' + dd[0]) + '.' + (mm[1] ? mm : '0' + mm[0]) + '.' + yyyy + ' ' + (hh[1] ? hh : '0' + hh[0]) + ':' + (mn[1] ? mn : '0' + mn[0]) + ':' + (ss[1] ? ss : '0' + ss[0]);
};
window.date_ddmmyyyy_withtime = date_ddmmyyyy_withtime;

export function date_from_ddmmyyyy(dateStr: string): Date {
    var parts: string[] = dateStr.split(".");
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]), 0, 0, 0, 0);
};
window.date_from_ddmmyyyy = date_from_ddmmyyyy;

export function numberToString(value: number, decimal: number): string {
    let result: string = "";
    if (value || value === 0) {
        if (value === 0) result = '-';
        else result = value.toFixed(decimal);// parseFloat(value).toFixed(2);
    }
    return result;
}
window.numberToString = numberToString;

export function numberPadZero(value: number, length: number) {
    let str:string = '' + value;
    while (str.length < length)
        str = '0' + str;
    return str;
}
window.numberPadZero = numberPadZero;

export function numberRound(value: number, places: number): number {
    let multiplier: number = Math.pow(10, places);
    return (Math.round(value * multiplier) / multiplier);
}
window.numberRound = numberRound;

/**
 * @see http://stackoverflow.com/q/7616461/940217
 * @return {number}
 */

export function strToHashCode(value: string): number {
    var hash = 0;
    if (value && value.length !== 0) {
        if (Array.prototype.reduce) {
            hash = value.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
        }
        else {
            for (let i = 0, icount = value.length ; i < icount; i++) {
                var character = value.charCodeAt(i);
                hash = ((hash << 5) - hash) + character;
                hash = hash & hash; // Convert to 32bit integer
            }
        }
    }
    return hash;
}
window.strToHashCode = strToHashCode


