define(["require", "exports", "app/core/variables", "app/core/utils", "app/controller/account/account"], function (require, exports, vars, utils, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            class Recovery extends acc.Controller.Account.Account {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/account/recovery.html", Id: "recovery-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "labelTitle": vars._statres("label$passwordRecovery"),
                        "labelEmail": vars._statres("label$email"),
                        "labelRecover": vars._statres("label$recover"),
                    });
                }
                createEvents() {
                    this.RecoveryButtonClick = this.createTouchClickEvent("btn-recovery", this.recoveryButtonClick);
                }
                destroyEvents() {
                    this.destroyTouchClickEvent("btn-recovery", this.RecoveryButtonClick);
                }
                recoveryButtonClick(e) {
                    let controller = this;
                    let model = {
                        Email: $('#recovery-email').val(),
                    };
                    if (controller.validate(model)) {
                        controller.AccountService.Recovery(model, (responseData) => {
                            if (responseData.Result == 0)
                                vars._app.ShowMessage(vars._statres("label$passwordRecovery"), vars._statres("msg$success$Recovery"), () => { vars._app.OpenController({ urlController: "account/login" }); });
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
            Account.Recovery = Recovery;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/recovery", function (module) { return new module.Controller.Account.Recovery(); }); //vars._app.SetControlNavigation(vars._app);
});
//# sourceMappingURL=recovery.js.map