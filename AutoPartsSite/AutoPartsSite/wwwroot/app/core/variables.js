/// <amd-dependency path="i18n!nls/strings" />
define(["require", "exports", "./utils", "i18n!nls/strings"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports._appData = exports.getTemplate = exports.unRegisterController = exports.registerController = exports.App = void 0;
    var App;
    (function (App) {
        var StaticResources = /** @class */ (function () {
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
    exports._identity = { Auth: false, Cms: false, Token: '', User: null };
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
        var Data = /** @class */ (function () {
            function Data() {
            }
            Object.defineProperty(Data.prototype, "Locale", {
                get: function () {
                    var locale = localStorage.getItem('locale');
                    if (!locale) {
                        locale = "en";
                        localStorage.setItem('locale', locale);
                    }
                    return locale ? locale : "en";
                },
                set: function (newlocale) {
                    var locale = this.Locale;
                    if (!locale || locale !== newlocale) {
                        localStorage.setItem('locale', newlocale);
                        //reload the app
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
                    return utils_1.isNullOrEmpty(settings) ? null : JSON.parse(settings);
                },
                set: function (value) {
                    localStorage.setItem('apsSettings', JSON.stringify(value));
                    var locale = this.Locale;
                    if (!locale || locale.toLocaleLowerCase() !== value.Language.Code.toLocaleLowerCase())
                        this.Locale = value.Language.Code.toLocaleLowerCase();
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
            return Data;
        }());
        App.Data = Data;
    })(App = exports.App || (exports.App = {}));
    exports._appData = new App.Data();
});
//# sourceMappingURL=variables.js.map