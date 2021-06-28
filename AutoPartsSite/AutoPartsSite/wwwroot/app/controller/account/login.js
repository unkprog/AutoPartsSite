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
            var Login = (function (_super) {
                __extends(Login, _super);
                function Login() {
                    return _super.call(this) || this;
                }
                Login.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/login.html", Id: "login-view", Page: "/account/login" };
                    return options;
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
                    vars._app.ShowLoading(true);
                    var controller = this;
                    var model = {
                        Email: $('#login-email').val(),
                        Pass: $('#login-pass').val(),
                        Uid: vars._appData.Uid
                    };
                    if (this.validate(model)) {
                        controller.AccountService.Login(model, function (responseData) {
                            if (responseData.Result === 0) {
                                vars._appData.Identity = responseData.Data;
                                vars._main.LogIn();
                                if (vars._appData.IsBasketCheckOut === true)
                                    vars._app.OpenController({ urlController: "basket/delivery" });
                                else
                                    vars._app.OpenController({ urlController: "search/index" });
                            }
                            else
                                vars._app.ShowError(responseData.Error);
                        });
                    }
                    else
                        vars._app.HideLoading();
                };
                Login.prototype.validate = function (model) {
                    var result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.Pass)) {
                        M.toast({ html: vars._statres('msg$error$passwordNotSpecified') });
                        result = false;
                    }
                    return result;
                };
                Login.prototype.registerButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "account/register", backController: this });
                    e.preventDefault();
                    return false;
                };
                Login.prototype.forgotButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "account/recovery", backController: this });
                    e.preventDefault();
                    return false;
                };
                return Login;
            }(acc.Controller.Account.Account));
            Account.Login = Login;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/login", function (module) { return new module.Controller.Account.Login(); });
});
//# sourceMappingURL=login.js.map