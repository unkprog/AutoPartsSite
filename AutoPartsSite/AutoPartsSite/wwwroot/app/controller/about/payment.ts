import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');

export namespace Controller.About {
    export class Payment extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/payment.html", Id: "payment-view", Page: "/about/payment" };
            return options;
        }
    }
}

vars.registerController("about/payment", function (module: any): Interfaces.IController { return new module.Controller.About.Payment(); });