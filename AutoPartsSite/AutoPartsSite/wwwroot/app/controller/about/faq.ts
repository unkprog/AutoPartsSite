import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');


export namespace Controller.About {
    export class Faq extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/faq.html", Id: "faq-view", Page: "/about/faq" };
            return options;
        }
    }
}

vars.registerController("about/faq", function (module: any): Interfaces.IController { return new module.Controller.About.Faq(); });