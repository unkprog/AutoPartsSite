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
define(["require", "exports", "app/core/variables", "app/core/utils", "app/controller/account/account"], function (require, exports, vars, utils, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var Recovery = (function (_super) {
                __extends(Recovery, _super);
                function Recovery() {
                    return _super.call(this) || this;
                }
                Recovery.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/recovery.html", Id: "recovery-view", Page: "/account/recovery" };
                    return options;
                };
                Recovery.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "labelTitle": vars._statres("label$passwordRecovery"),
                        "labelEmail": vars._statres("label$email"),
                        "labelRecover": vars._statres("label$recover"),
                    });
                };
                Recovery.prototype.createEvents = function () {
                    this.RecoveryButtonClick = this.createTouchClickEvent("btn-recovery", this.recoveryButtonClick);
                };
                Recovery.prototype.destroyEvents = function () {
                    this.destroyTouchClickEvent("btn-recovery", this.RecoveryButtonClick);
                };
                Recovery.prototype.recoveryButtonClick = function (e) {
                    var controller = this;
                    var model = {
                        Email: $('#recovery-email').val(),
                    };
                    if (controller.validate(model)) {
                        controller.AccountService.Recovery(model, function (responseData) {
                            if (responseData.Result == 0)
                                vars._app.ShowMessage(vars._statres("label$passwordRecovery"), vars._statres("msg$success$Recovery"), function () { vars._app.OpenController({ urlController: "account/login" }); });
                            else
                                vars._app.ShowError(responseData.Error);
                        });
                    }
                };
                Recovery.prototype.validate = function (model) {
                    var result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    return result;
                };
                return Recovery;
            }(acc.Controller.Account.Account));
            Account.Recovery = Recovery;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/recovery", function (module) { return new module.Controller.Account.Recovery(); });
});
//# sourceMappingURL=recovery.js.map