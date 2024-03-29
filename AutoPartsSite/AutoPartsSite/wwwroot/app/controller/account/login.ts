﻿import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {

    export class Login extends acc.Controller.Account.Account {
        constructor() {
           super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/login.html", Id: "login-view", Page: "/account/login" };
            return options;
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
            let self = this;
            self.LoginButtonClick = self.createTouchClickEvent("btn-login", self.loginButtonClick);
            self.RegisterButtonClick = self.createTouchClickEvent("btn-register", self.registerButtonClick);
            self.ForgotButtonClick = self.createTouchClickEvent("btn-forgot", self.forgotButtonClick);


            self.View.find("#login-email").keypress(function (event) {
                if (event.keyCode === 13) {
                    self.LoginButtonClick(undefined);
                }
            });

            self.View.find("#login-pass").keypress(function (event) {
                if (event.keyCode === 13) {
                    self.LoginButtonClick(undefined);
                }
            });
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("btn-login", this.LoginButtonClick);
            this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
            this.destroyTouchClickEvent("btn-forgot", this.ForgotButtonClick);
        }

        public LoginButtonClick: { (e: any): void; };
        private loginButtonClick(e) {
            vars._app.ShowLoading(true);
            let controller = this;
            let model: Interfaces.Model.ILoginModel = {
                Email: <string>$('#login-email').val(),
                Pass: <string>$('#login-pass').val(),
                Uid: vars._appData.Uid
            };

            if (this.validate(model)) {
                controller.AccountService.Login(model, (responseData) => {
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
            vars._app.OpenController({ urlController: "account/register" });
            e.preventDefault();
            return false;
        }

        public ForgotButtonClick: { (e: any): void; };
        private forgotButtonClick(e) {
            vars._app.OpenController({ urlController: "account/recovery" });
            e.preventDefault();
            return false;
        }
    }
}

vars.registerController("account/login", function (module: any): Interfaces.IController { return new module.Controller.Account.Login(); }); //vars._app.SetControlNavigation(vars._app); 