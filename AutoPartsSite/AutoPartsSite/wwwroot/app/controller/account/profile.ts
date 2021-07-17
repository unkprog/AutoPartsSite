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
                "Header": vars._statres("label$profile")
            });
        }

        protected createEvents(): void {
        }

        protected destroyEvents(): void {
        }
    }
}

vars.registerController("account/profile", function (module: any): Interfaces.IController { return new module.Controller.Account.Profile(); });