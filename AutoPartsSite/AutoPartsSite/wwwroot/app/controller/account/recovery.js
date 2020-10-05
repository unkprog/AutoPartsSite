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
define(["require", "exports", "app/core/variables", "app/core/utils", "app/services/accountservice", "app/core/basecontroller"], function (require, exports, vars, utils, acc, bc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var Recovery = /** @class */ (function (_super) {
                __extends(Recovery, _super);
                function Recovery() {
                    var _this = _super.call(this) || this;
                    _this.accountService = new acc.Services.AccountService();
                    return _this;
                }
                Recovery.prototype.createOptions = function () {
                    return { Url: "/app/controller/account/recovery.html", Id: "recovery-view" };
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
                        email: $('#recovery-email').val(),
                    };
                    if (this.validate(model)) {
                        this.accountService.Recovery(model, function (responseData) {
                            if (responseData.result == "Ok")
                                vars._app.ShowMessage(vars._statres("label$passwordRecovery"), vars._statres("msg$success$Recovery"), function () { vars._app.OpenController({ urlController: "account/login" }); });
                            else
                                vars._app.ShowError(responseData);
                        });
                    }
                };
                Recovery.prototype.validate = function (model) {
                    var validateMessage = '';
                    if (!utils.validatePhone(model.email))
                        validateMessage = validateMessage + (validateMessage !== '' ? '<br/>' : '') + vars._statres('msg$error$emailIncorrect');
                    if (validateMessage !== '')
                        vars._showError(validateMessage);
                    return (validateMessage === '');
                };
                return Recovery;
            }(bc.Controller.Base));
            Account.Recovery = Recovery;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/recovery", function (module) { return new module.Controller.Account.Recovery(); }); //vars._app.SetControlNavigation(vars._app);
});
//# sourceMappingURL=recovery.js.map