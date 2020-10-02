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
define(["require", "exports", "app/core/basecontroller", "app/core/variables", "app/core/utils", "app/services/accountservice"], function (require, exports, bc, vars, utils, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var Register = /** @class */ (function (_super) {
                __extends(Register, _super);
                function Register() {
                    var _this = _super.call(this) || this;
                    _this.accountService = new acc.Services.AccountService();
                    return _this;
                }
                Register.prototype.createOptions = function () {
                    return { Url: "/app/controller/account/register.html", Id: "app-register" };
                };
                Register.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "labelTitle": vars._statres("button$label$register"),
                        "labelPhone": vars._statres("label$phone"),
                        "labelEmail": vars._statres("label$email"),
                        "labelPassword": vars._statres("label$password"),
                        "labelConfirmPassword": vars._statres("label$confirmPassword"),
                        "labelRegister": vars._statres("button$label$register"),
                    });
                };
                Register.prototype.createEvents = function () {
                    this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
                };
                Register.prototype.destroyEvents = function () {
                    this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
                };
                Register.prototype.registerButtonClick = function (e) {
                    var controller = this;
                    var model = {
                        email: $('#register-email').val()
                    };
                    if (this.validate(model)) {
                        controller.accountService.Register(model, function (responseData) {
                            if (responseData.result == "Ok")
                                vars._app.ShowMessage(vars._statres("label$passwordRecovery"), vars._statres("msg$success$Register"), function () { vars._app.OpenController({ urlController: "security/login" }); });
                            else
                                vars._app.ShowError(responseData);
                        });
                    }
                };
                Register.prototype.validate = function (model) {
                    var validateMessage = '';
                    if (!utils.isNullOrEmpty(model.email) && !utils.validateEmail(model.email))
                        validateMessage = validateMessage + (validateMessage !== '' ? '<br/>' : '') + vars._statres('msg$error$emailIncorrect');
                    if (validateMessage !== '')
                        vars._showError(validateMessage);
                    return (validateMessage === '');
                };
                return Register;
            }(bc.Controller.Base));
            Account.Register = Register;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/register", function (module) { vars._app.SetControlNavigation(vars._app); return new module.Controller.Account.Register(); });
});
//# sourceMappingURL=register.js.map