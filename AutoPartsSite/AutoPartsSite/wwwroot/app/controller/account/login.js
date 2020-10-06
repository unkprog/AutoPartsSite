define(["require", "exports", "app/core/variables", "app/core/utils", "app/controller/account/account"], function (require, exports, vars, utils, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            class Login extends acc.Controller.Account.Account {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/account/login.html", Id: "login-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$AutoPartsSite"),
                        "labelTitle": vars._statres("label$autorization"),
                        "labelEmail": vars._statres("label$email"),
                        "labelPassword": vars._statres("label$password"),
                        "labelForgot": vars._statres("button$label$forgot"),
                        "labelRegister": vars._statres("button$label$register"),
                        "labelEnter": vars._statres("button$label$enter"),
                    });
                }
                createEvents() {
                    this.LoginButtonClick = this.createTouchClickEvent("btn-login", this.loginButtonClick);
                    this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
                    this.ForgotButtonClick = this.createTouchClickEvent("btn-forgot", this.forgotButtonClick);
                }
                destroyEvents() {
                    this.destroyTouchClickEvent("btn-login", this.LoginButtonClick);
                    this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
                    this.destroyTouchClickEvent("btn-forgot", this.ForgotButtonClick);
                }
                loginButtonClick(e) {
                    vars._app.ShowLoading();
                    let controller = this;
                    let model = {
                        Email: $('#login-email').val(),
                        Pass: $('#login-pass').val()
                    };
                    if (this.validate(model)) {
                        controller.AccountService.Login(model, (responseData) => {
                            if (responseData.result === 0) {
                                vars._identity = responseData.indetity;
                                vars._app.OpenController({ urlController: "main" });
                            }
                            else
                                vars._app.ShowError(responseData.Error);
                        });
                    }
                    else
                        vars._app.HideLoading();
                }
                validate(model) {
                    let result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.Pass)) {
                        M.toast({ html: vars._statres('msg$error$passwordNotSpecified') });
                        result = false;
                    }
                    return result;
                }
                registerButtonClick(e) {
                    vars._app.OpenController({ urlController: "account/register", backController: this });
                    e.preventDefault();
                    return false;
                }
                forgotButtonClick(e) {
                    vars._app.OpenController({ urlController: "account/recovery", backController: this });
                    e.preventDefault();
                    return false;
                }
            }
            Account.Login = Login;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/login", function (module) { return new module.Controller.Account.Login(); }); //vars._app.SetControlNavigation(vars._app); 
});
//# sourceMappingURL=login.js.map