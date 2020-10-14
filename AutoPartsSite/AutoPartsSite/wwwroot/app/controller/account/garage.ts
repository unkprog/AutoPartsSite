import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Garage extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/account/garage.html", Id: "garage-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$garage")
            });
        }

        protected createEvents(): void {
        }

        protected destroyEvents(): void {
        }
    }
}

vars.registerController("account/garage", function (module: any): Interfaces.IController { return new module.Controller.Account.Garage(); });