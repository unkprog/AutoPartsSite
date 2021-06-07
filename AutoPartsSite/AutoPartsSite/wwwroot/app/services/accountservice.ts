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

        public SettingsData(isSetup: boolean, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/settingsdata", RequestData: { langId: vars._appData.Locale.Id, isSetup: isSetup }, Callback: Callback });
        }
    }
}