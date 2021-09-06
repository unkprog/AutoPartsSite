import base = require("app/core/baseservice");
import vars = require('app/core/variables');

export namespace Services {
    export class AccountService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/account' };
        }

        public Register(model: Interfaces.Model.IRegisterModel, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/register", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public Recovery(model: Interfaces.Model.IRegisterModel, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/recovery", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public ChangePass(model: Interfaces.Model.IProfileUserModel, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/changepass", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public Login(model: Interfaces.Model.ILoginModel, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/login", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public Logout(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/logout", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
        }

        public Uid(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/uid", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
        }

        public Settings(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/settings", Callback: Callback });
        }

        public SettingsData(langId:number, isSetup: boolean, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/settingsdata", RequestData: { langId: langId, isSetup: isSetup }, Callback: Callback });
        }

        public Orders(Callback: (responseData: any) => void) {
            let qs = {
                uid: vars._appData.Uid,
                Auth: vars._appData.Identity.Auth,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id
            };
            this.PostApi({ Action: "/orders", RequestData: JSON.stringify(qs), Callback: Callback });
        }

        public GetAskQuestions(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/askquestions", RequestData: undefined, Callback: Callback });
        }
    }
}