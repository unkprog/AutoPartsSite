import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Settings extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/account/settings.html", Id: "settings-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$settings")
            });
        }

        public ViewShow(e: any): boolean {
            this.View.find('select').formSelect();
            return super.ViewShow(e);
        }

        protected createEvents(): void {
        }

        protected destroyEvents(): void {
        }
    }
}

vars.registerController("account/settings", function (module: any): Interfaces.IController { return new module.Controller.Account.Settings(); });