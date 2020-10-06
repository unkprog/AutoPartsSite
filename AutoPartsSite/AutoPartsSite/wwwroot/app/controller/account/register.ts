import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Register extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/account/register.html", Id: "register-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "labelTitle": vars._statres("button$label$register"),
                "labelEmail": vars._statres("label$email"),
                "labelPassword": vars._statres("label$password"),
                "labelConfirmPassword": vars._statres("label$confirmPassword"),
                "labelRegister": vars._statres("button$label$register"),
            });
        }

        protected createEvents(): void {
            this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
        }

        public RegisterButtonClick: { (e: any): void; };
        private registerButtonClick(e) {
            let controller = this;
            let model: Interfaces.Model.IRegisterModel = {
                Email: <string>$('#register-email').val()
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

vars.registerController("account/register", function (module: any): Interfaces.IController { return new module.Controller.Account.Register(); }); //vars._app.SetControlNavigation(vars._app);