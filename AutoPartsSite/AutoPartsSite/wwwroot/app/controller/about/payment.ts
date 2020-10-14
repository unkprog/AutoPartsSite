import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.About {
    export class Payment extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/about/payment.html", Id: "payment-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$payment")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("about/payment", function (module: any): Interfaces.IController { return new module.Controller.About.Payment(); });