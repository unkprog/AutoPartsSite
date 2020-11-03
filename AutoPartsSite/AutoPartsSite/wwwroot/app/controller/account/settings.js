var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var Settings = /** @class */ (function (_super) {
                __extends(Settings, _super);
                function Settings() {
                    return _super.call(this) || this;
                }
                Settings.prototype.createOptions = function () {
                    return { Url: "/app/controller/account/settings.html", Id: "settings-view" };
                };
                Settings.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$settings")
                    });
                };
                Settings.prototype.ViewShow = function (e) {
                    this.View.find('select').formSelect();
                    return _super.prototype.ViewShow.call(this, e);
                };
                Settings.prototype.createEvents = function () {
                };
                Settings.prototype.destroyEvents = function () {
                };
                return Settings;
            }(acc.Controller.Account.Account));
            Account.Settings = Settings;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/settings", function (module) { return new module.Controller.Account.Settings(); });
});
//# sourceMappingURL=settings.js.map