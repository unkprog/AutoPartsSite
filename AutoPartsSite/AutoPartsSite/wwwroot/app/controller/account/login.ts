import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {

    export class Login extends acc.Controller.Account.Account {
        constructor() {
           super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/account/login.html", Id: "login-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
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

        protected createEvents(): void {
            this.LoginButtonClick = this.createTouchClickEvent("btn-login", this.loginButtonClick);
            this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
            this.ForgotButtonClick = this.createTouchClickEvent("btn-forgot", this.forgotButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("btn-login", this.LoginButtonClick);
            this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
            this.destroyTouchClickEvent("btn-forgot", this.ForgotButtonClick);
        }

        public LoginButtonClick: { (e: any): void; };
        private loginButtonClick(e) {
            vars._app.ShowLoading();
            let controller = this;
            let model: Interfaces.Model.ILoginModel = {
                Email: <string>$('#login-email').val(),
                Pass: <string>$('#login-pass').val()
            };

            if (this.validate(model)) {
                controller.AccountService.Login(model, (responseData) => {
                    if (responseData.Result === 0) {
                        vars._identity = responseData.Data;
                        vars._app.OpenController({ urlController: "search/index" });
                        vars._main.LogIn();
                        vars._app.HideLoading();
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                });
            }
            else
                vars._app.HideLoading();
        }

        private validate(model: Interfaces.Model.ILoginModel): boolean {
            let result: boolean = true;

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

        public RegisterButtonClick: { (e: any): void; };
        private registerButtonClick(e) {
            vars._app.OpenController({ urlController: "account/register", backController: this });
            e.preventDefault();
            return false;
        }

        public ForgotButtonClick: { (e: any): void; };
        private forgotButtonClick(e) {
            vars._app.OpenController({ urlController: "account/recovery", backController: this });
            e.preventDefault();
            return false;
        }
    }
}

vars.registerController("account/login", function (module: any): Interfaces.IController { return new module.Controller.Account.Login(); }); //vars._app.SetControlNavigation(vars._app); 