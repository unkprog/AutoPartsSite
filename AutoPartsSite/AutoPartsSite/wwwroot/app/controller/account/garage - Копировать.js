define(["require", "exports", "app/core/variables", "app/core/utils", "app/controller/account/account"], function (require, exports, vars, utils, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            class Register extends acc.Controller.Account.Account {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/account/register.html", Id: "register-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "labelTitle": vars._statres("button$label$register"),
                        "labelEmail": vars._statres("label$email"),
                        "labelPassword": vars._statres("label$password"),
                        "labelConfirmPassword": vars._statres("label$confirmPassword"),
                        "labelRegister": vars._statres("button$label$register"),
                    });
                }
                createEvents() {
                    this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
                }
                destroyEvents() {
                    this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
                }
                registerButtonClick(e) {
                    let controller = this;
                    let model = {
                        Email: $('#register-email').val()
                    };
                    if (this.validate(model)) {
                        controller.AccountService.Register(model, (responseData) => {
                            if (responseData.Result == 0)
                                vars._app.ShowMessage(vars._statres("button$label$register"), vars._statres("msg$success$Register"), () => {
                                    vars._app.OpenController({
                                        urlController: "account/login"
                                    });
                                });
                            else
                                vars._app.ShowError(responseData.Error);
                        });
                    }
                }
                validate(model) {
                    let result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    return result;
                }
            }
            Account.Register = Register;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/register", function (module) { return new module.Controller.Account.Register(); }); //vars._app.SetControlNavigation(vars._app);
});
//# sourceMappingURL=register.js.map