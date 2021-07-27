import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Recovery extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/recovery.html", Id: "recovery-view", Page: "/account/recovery" };
            return options
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "labelTitle": vars._statres("label$passwordRecovery"),
                "labelEmail": vars._statres("label$email"),
                "labelRecover": vars._statres("label$recover"),
                "labelLogin": vars._statres("button$label$enter"),
                "labelRegister": vars._statres("button$label$register")
            });
        }

        protected createEvents(): void {
            let self = this;

            self.RecoveryButtonClick = self.createTouchClickEvent("btn-recovery", self.recoveryButtonClick);
            self.LoginButtonClick = self.createTouchClickEvent("btn-login", self.loginButtonClick);
            self.RegisterButtonClick = self.createTouchClickEvent("btn-register", self.registerButtonClick);

            self.View.find("#recovery-email").keypress(function (event) {
                if (event.keyCode === 13) {
                    self.RecoveryButtonClick(undefined);
                }
            });
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("btn-recovery", this.RecoveryButtonClick);
            this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
            this.destroyTouchClickEvent("btn-login", this.LoginButtonClick);
        }

        public RecoveryButtonClick: { (e: any): void; };
        private recoveryButtonClick(e) {
            let controller = this;
            let model: Interfaces.Model.IRegisterModel = {
                Email: <string>$('#recovery-email').val(),
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

        public RegisterButtonClick: { (e: any): void; };
        private registerButtonClick(e) {
            vars._app.OpenController({ urlController: "account/register" });
            e.preventDefault();
            return false;
        }

        public LoginButtonClick: { (e: any): void; };
        private loginButtonClick(e) {
            vars._app.OpenController({ urlController: "account/login" });
            e.preventDefault();
            return false;
        }

        private validate(model: Interfaces.Model.IRegisterModel): boolean {
            let result: boolean = true;

            if (!utils.validateEmail(model.Email)) {
                M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                result = false;
            }
       
            return result;
        }
    }
}

vars.registerController("account/recovery", function (module: any): Interfaces.IController { return new module.Controller.Account.Recovery(); }); //vars._app.SetControlNavigation(vars._app);