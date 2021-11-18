define(["require", "exports", "./utils", "i18n!nls/strings"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._appData = exports.getTemplate = exports.unRegisterController = exports.registerController = exports.App = void 0;
    var App;
    (function (App) {
        var StaticResources = (function () {
            function StaticResources() {
                this.i18nData = require("i18n!nls/strings");
            }
            StaticResources.prototype.GetString = function (id) {
                return (this.i18nData && this.i18nData[id]) ? this.i18nData[id] : "";
            };
            return StaticResources;
        }());
        App.StaticResources = StaticResources;
    })(App = exports.App || (exports.App = {}));
    var staticResources = new App.StaticResources();
    exports._statres = function (id) { return staticResources.GetString(id); };
    exports._showError = function (error) { exports._app.ShowError(error); };
    exports._controllers = {};
    exports._controllers["main"] = function (module) { return new module.Controller.Main(); };
    function registerController(crtlId, funcConstructor) {
        if (!exports._controllers[crtlId])
            exports._controllers[crtlId] = funcConstructor;
    }
    exports.registerController = registerController;
    function unRegisterController(crtlId) {
        if (exports._controllers[crtlId])
            delete exports._controllers[crtlId];
    }
    exports.unRegisterController = unRegisterController;
    exports._editorData = {};
    exports._templates = {};
    function getTemplate(template) {
        var result;
        var hash = window.strToHashCode(template);
        result = exports._templates['' + hash];
        if (!result) {
            result = kendo.template(template);
            exports._templates['' + hash] = result;
        }
        return result;
    }
    exports.getTemplate = getTemplate;
    exports.WeekNamesByValue = ["", exports._statres("label$dayweek$sun"), exports._statres("label$dayweek$mon"), exports._statres("label$dayweek$tue"), exports._statres("label$dayweek$wed"), exports._statres("label$dayweek$thu"), exports._statres("label$dayweek$fri"), exports._statres("label$dayweek$sat")];
    window.WeekNamesByValue = exports.WeekNamesByValue;
    exports.sumTextColor = '#2196f3';
    exports.checkTextColor = '#ff9800';
    exports.positionTextColor = '#4caf50';
    (function (App) {
        var Data = (function () {
            function Data() {
                this._identity = { Auth: false, Cms: false, Token: '', User: null, SiteUserId: 0 };
            }
            Object.defineProperty(Data.prototype, "Identity", {
                get: function () {
                    return this._identity;
                },
                set: function (identity) {
                    this._identity = identity;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "Version", {
                get: function () {
                    return this._version;
                },
                set: function (version) {
                    this._version = version;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "Locale", {
                get: function () {
                    var locale = localStorage.getItem('locale');
                    var result = undefined;
                    if (locale && locale != null && locale != "") {
                        try {
                            result = JSON.parse(locale);
                        }
                        catch (_a) {
                            result = undefined;
                        }
                    }
                    if (!result) {
                        result = { Id: 0, Code: "EN", Name: "English" };
                        localStorage.setItem('locale', JSON.stringify(result));
                    }
                    return result;
                },
                set: function (newlocale) {
                    var locale = this.Locale;
                    if (newlocale && newlocale != null && locale.Id !== newlocale.Id) {
                        localStorage.setItem('locale', JSON.stringify(newlocale));
                        location.reload();
                    }
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "Uid", {
                get: function () {
                    var uid = localStorage.getItem('apsUID');
                    if (!uid) {
                        uid = M.guid();
                        localStorage.setItem('apsUID', uid);
                    }
                    return uid;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "Settings", {
                get: function () {
                    var settings = localStorage.getItem('apsSettings');
                    var result = utils_1.isNullOrEmpty(settings) ? null : JSON.parse(settings);
                    if (result != null && result.Country == null)
                        result.Country = { Id: 0, Code: '', Name: '' };
                    return result;
                },
                set: function (value) {
                    localStorage.setItem('apsSettings', JSON.stringify(value));
                    var locale = this.Locale;
                    if (value && value.Language && locale.Id !== value.Language.Id)
                        this.Locale = value.Language;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "PageEditItemHeader", {
                get: function () {
                    var pageEditItemHeader = localStorage.getItem('PageEditItemHeader');
                    return pageEditItemHeader ? pageEditItemHeader : "";
                },
                set: function (pageEditItemHeader) {
                    localStorage.setItem('PageEditItemHeader', pageEditItemHeader);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "PageEditItem", {
                get: function () {
                    var pageEditItem = localStorage.getItem('PageEditItem');
                    return pageEditItem ? pageEditItem : "";
                },
                set: function (pageEditItem) {
                    localStorage.setItem('PageEditItem', pageEditItem);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "NewViewItemId", {
                get: function () {
                    return parseInt(localStorage.getItem('new-view-item-id'), 0);
                },
                set: function (id) {
                    localStorage.setItem('new-view-item-id', '' + id);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "OrderId", {
                get: function () {
                    return parseInt(localStorage.getItem('order-id'), 0);
                },
                set: function (id) {
                    localStorage.setItem('order-id', '' + id);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "MessageId", {
                get: function () {
                    return parseInt(localStorage.getItem('message-id'), 0);
                },
                set: function (id) {
                    localStorage.setItem('message-id', '' + id);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "AddressId", {
                get: function () {
                    return parseInt(localStorage.getItem('address-id'), 0);
                },
                set: function (id) {
                    localStorage.setItem('address-id', '' + id);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "IsBasketCheckOut", {
                get: function () {
                    var basketCheckOut = localStorage.getItem('basketCheckOut');
                    return (basketCheckOut && basketCheckOut == "true" ? true : false);
                },
                set: function (val) {
                    if (val === true)
                        localStorage.setItem('basketCheckOut', 'true');
                    else
                        localStorage.removeItem('basketCheckOut');
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Data.prototype, "PayOrderType", {
                get: function () {
                    var payOrderType = localStorage.getItem('payOrderType');
                    return (payOrderType && payOrderType == "1" ? 1 : 0);
                },
                set: function (val) {
                    localStorage.setItem('payOrderType', '' + val);
                },
                enumerable: false,
                configurable: true
            });
            Data.prototype.SetOrderBasket = function (orderId, payOrderType, isBasketCheckOut) {
                this.OrderId = orderId;
                this.PayOrderType = payOrderType;
                this.IsBasketCheckOut = isBasketCheckOut;
            };
            Object.defineProperty(Data.prototype, "BasketIsInit", {
                get: function () {
                    var basketIsInit = localStorage.getItem('basketIsInit');
                    return (basketIsInit && basketIsInit == "true" ? true : false);
                },
                set: function (val) {
                    if (val === true)
                        localStorage.setItem('basketIsInit', 'true');
                    else
                        localStorage.removeItem('basketIsInit');
                },
                enumerable: false,
                configurable: true
            });
            return Data;
        }());
        App.Data = Data;
    })(App = exports.App || (exports.App = {}));
    exports._appData = new App.Data();
});
//# sourceMappingURL=variables.js.map