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
define(["require", "exports", "app/core/baseservice", "app/core/variables"], function (require, exports, base, vars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        var AccountService = /** @class */ (function (_super) {
            __extends(AccountService, _super);
            function AccountService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(AccountService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/account' };
                },
                enumerable: false,
                configurable: true
            });
            AccountService.prototype.Register = function (model, Callback) {
                this.PostApi({ Action: "/register", RequestData: JSON.stringify(model), Callback: Callback });
            };
            AccountService.prototype.Recovery = function (model, Callback) {
                this.PostApi({ Action: "/recovery", RequestData: JSON.stringify(model), Callback: Callback });
            };
            AccountService.prototype.Login = function (model, Callback) {
                this.PostApi({ Action: "/login", RequestData: JSON.stringify(model), Callback: Callback });
            };
            AccountService.prototype.Logout = function (Callback) {
                this.GetApi({ Action: "/logout", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
            };
            AccountService.prototype.Uid = function (Callback) {
                this.GetApi({ Action: "/uid", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
            };
            AccountService.prototype.Settings = function (Callback) {
                this.GetApi({ Action: "/settings", Callback: Callback });
            };
            AccountService.prototype.SettingsData = function (langId, isSetup, Callback) {
                this.GetApi({ Action: "/settingsdata", RequestData: { langId: langId, isSetup: isSetup }, Callback: Callback });
            };
            return AccountService;
        }(base.Services.BaseService));
        Services.AccountService = AccountService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=accountservice.js.map