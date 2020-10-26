import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');

export namespace Controller.About {
    export class Shipping extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/shipping.html", Id: "shipping-view", Page: "/about/shipping" };
            return options;
        }
    }
}

vars.registerController("about/shipping", function (module: any): Interfaces.IController { return new module.Controller.About.Shipping(); });