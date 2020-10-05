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
            var Login = /** @class */ (function (_super) {
                __extends(Login, _super);
                function Login() {
                    return _super.call(this) || this;
                }
                Login.prototype.createOptions = function () {
                    return { Url: "/app/controller/account/login.html", Id: "login-view" };
                };
                Login.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$AutoPartsSite"),
                        "labelTitle": vars._statres("label$autorization"),
                        "labelEmail": vars._statres("label$email"),
                        "labelPassword": vars._statres("label$password"),
                        "labelForgot": vars._statres("button$label$forgot"),
                        "labelRegister": vars._statres("button$label$register"),
                        "labelEnter": vars._statres("button$label$enter"),
                    });
                };
                Login.prototype.createEvents = function () {
                    this.LoginButtonClick = this.createTouchClickEvent("btn-login", this.loginButtonClick);
                    this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
                    this.ForgotButtonClick = this.createTouchClickEvent("btn-forgot", this.forgotButtonClick);
                };
                Login.prototype.destroyEvents = function () {
                    this.destroyTouchClickEvent("btn-login", this.LoginButtonClick);
                    this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
                    this.destroyTouchClickEvent("btn-forgot", this.ForgotButtonClick);
                };
                Login.prototype.loginButtonClick = function (e) {
                    vars._app.ShowLoading();
                    var controller = this;
                    var model = {
                        email: $('#login-email').val(),
                        password: $('#login-pass').val()
                    };
                    // TODO: Заглушка на демо-вход
                    if (utils.isNullOrEmpty(model.email) && utils.isNullOrEmpty(model.password)) {
                        model.email = "9264042915_";
                        model.password = "1";
                    }
                    if (this.validate(model)) {
                        controller.AccountService.Login(model, function (responseData) {
                            if (responseData.result == "Ok") {
                                vars._identity = responseData.indetity;
                                vars._app.OpenController({ urlController: "main" });
                            }
                            else
                                vars._app.ShowError(responseData.error);
                        });
                    }
                    else
                        vars._app.HideLoading();
                };
                Login.prototype.validate = function (model) {
                    var result = true;
                    if (model.email != "9264042915_" && !utils.validateEmail(model.email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.password)) {
                        M.toast({ html: vars._statres('msg$error$passwordNotSpecified') });
                        result = false;
                    }
                    return result;
                };
                Login.prototype.registerButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "account/register", backController: this });
                };
                Login.prototype.forgotButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "account/recovery", backController: this });
                };
                return Login;
            }(acc.Controller.Account.Account));
            Account.Login = Login;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/login", function (module) { return new module.Controller.Account.Login(); }); //vars._app.SetControlNavigation(vars._app); 
});
//# sourceMappingURL=login.js.map