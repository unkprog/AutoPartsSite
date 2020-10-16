/// <amd-dependency path="i18n!nls/strings" />
define(["require", "exports", "i18n!nls/strings"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTemplate = exports.unRegisterController = exports.registerController = exports.App = void 0;
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
    exports._identity = { Auth: false, Token: '', User: null };
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
});
//# sourceMappingURL=variables.js.map