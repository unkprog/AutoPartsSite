import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Register extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/register.html", Id: "register-view", Page: "/account/register" };
            return options
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("button$label$register"),
                "labelEmail": vars._statres("label$email"),
                "labelPassword": vars._statres("label$password"),
                "labelConfirmPassword": vars._statres("label$confirmPassword"),
                "labelRegister": vars._statres("button$label$register"),
                "labelRecover": vars._statres("label$recover"),
                "labelLogin": vars._statres("button$label$enter")
            });
        }

        public ViewShow(e: any): boolean {
            super.ViewShow(e);
            this.loadSettingsData();
            return false;
        }

        protected createEvents(): void {
            this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
            this.RecoveryButtonClick = this.createTouchClickEvent("btn-recovery", this.recoveryButtonClick);
            this.LoginButtonClick = this.createTouchClickEvent("btn-login", this.loginButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("btn-recovery", this.RecoveryButtonClick);
            this.destroyTouchClickEvent("btn-login", this.LoginButtonClick);
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

        public RecoveryButtonClick: { (e: any): void; };
        private recoveryButtonClick(e) {
            vars._app.OpenController({ urlController: "account/recovery"});
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

        private loadSettingsData(): void {
            let self = this;
            vars._app.ShowLoading(true);
            self.AccountService.SettingsData(vars._appData.Locale.Id, vars._appData.Settings === null, (responseData) => {
                if (responseData.Result === 0) {
                    self.setupLists(responseData.Data);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        private setupLists(responseData) {
            let settingsData: Interfaces.Model.ISettingsData = responseData;
            let countries: Interfaces.Model.IReferenceNamedDbModel[] = settingsData.Countries;
            let settings: Interfaces.Model.ISettings = vars._appData.Settings;
            if (settings == null)
                settings = settingsData.Current;

            let html: string = '';
            for (let i = 0, icount = countries.length; i < icount; i++) {
                html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                html = html + countries[i].Code + ' - ' + countries[i].Name + '</option>';
            }
            $('#register-view-country').html(html);
            this.View.find('select').formSelect();
        }

    }
}

vars.registerController("account/register", function (module: any): Interfaces.IController { return new module.Controller.Account.Register(); }); //vars._app.SetControlNavigation(vars._app);