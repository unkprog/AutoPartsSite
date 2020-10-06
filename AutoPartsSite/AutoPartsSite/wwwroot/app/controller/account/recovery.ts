import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Recovery extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/account/recovery.html", Id: "recovery-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "labelTitle": vars._statres("label$passwordRecovery"),
                "labelEmail": vars._statres("label$email"),
                "labelRecover": vars._statres("label$recover"),
            });
        }

        protected createEvents(): void {
            this.RecoveryButtonClick = this.createTouchClickEvent("btn-recovery", this.recoveryButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("btn-recovery", this.RecoveryButtonClick);
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

        private validate(model: Interfaces.Model.IRegisterModel): boolean {
            let validateMessage: string = '';

            if (!utils.validateEmail(model.Email))
                validateMessage = validateMessage + (validateMessage !== '' ? '<br/>' : '') + vars._statres('msg$error$emailIncorrect');

            if (validateMessage !== '')
                vars._showError(validateMessage);

            return (validateMessage === '');
        }
    }
}

vars.registerController("account/recovery", function (module: any): Interfaces.IController { return new module.Controller.Account.Recovery(); }); //vars._app.SetControlNavigation(vars._app);