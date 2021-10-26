import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Profile extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/profile.html", Id: "profile-view", Page: "/account/profile" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$profile"),
                "labelEmail": vars._statres("label$email"),
                "labelPassword": vars._statres("label$password"),
                "labelChange": vars._statres("label$password$change"),
                "labelNewPassword": vars._statres("label$password$new"),
                "Email": ""
            });
        }

        protected OnViewInit(): void {
            this.Model.set("Email", vars._appData.Identity.User.Email);
        }

        protected createEvents(): void {
            let self = this;
            self.ChangeButtonClick = self.createTouchClickEvent("profile-view-btn-change", self.changeButtonClick);
            self.PassModalButtonClick = self.createTouchClickEvent("profile-view-btn-change-modal", self.passModalButtonClick);
        }

        protected destroyEvents(): void {
            let self = this;
            self.destroyTouchClickEvent("profile-view-btn-change-modal", self.PassModalButtonClick);
            self.destroyTouchClickEvent("profile-view-btn-change", self.ChangeButtonClick);
        
        }

        enterPassModal: JQuery;

        public ChangeButtonClick: { (e: any): void; };
        private changeButtonClick(e) {
            let controller = this;
            let model: Interfaces.Model.IProfileUserModel = {
                Email: vars._appData.Identity.User.Email,
                Pass: '',
                Uid: vars._appData.Identity.Token,
                ChangePass: <string>$('#profile-view-new-pass').val(),
            };

            if (controller.validate(model)) {
                controller.enterPassModal = controller.View.find('#profile-view-pass-modal').modal();
                controller.enterPassModal.modal('open');
            }
        }

        public PassModalButtonClick: { (e: any): void; };
        private passModalButtonClick(e) {
            let controller = this;
            let model: Interfaces.Model.IProfileUserModel = {
                Email: vars._appData.Identity.User.Email,
                Pass: <string>$('#profile-view-pass').val(),
                Uid: vars._appData.Identity.Token,
                ChangePass: <string>$('#profile-view-new-pass').val(),
            };

            if (controller.enterPassModal)
                controller.enterPassModal.modal('close');

            controller.AccountService.ChangePass(model, (responseData) => {
                if (responseData.Result == 0)
                    vars._app.ShowMessage(vars._statres("label$password"), vars._statres("msg$success$Recovery"), () => {
                        $('#profile-view-login-pass').val('');
                    });
                else
                    vars._app.ShowError(responseData.Error);
            });
        }

        private validate(model: Interfaces.Model.IProfileUserModel): boolean {
            let result: boolean = true;

            if (!utils.validateEmail(model.Email)) {
                M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                result = false;
            }

            return result;
        }
    }
}

vars.registerController("account/profile", function (module: any): Interfaces.IController { return new module.Controller.Account.Profile(); });