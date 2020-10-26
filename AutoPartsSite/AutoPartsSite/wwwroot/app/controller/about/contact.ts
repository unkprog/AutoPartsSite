import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');

export namespace Controller.About {
    export class Contact extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/contact.html", Id: "contact-view", Page: "/about/contact" };
            return options;
        }
    }
}

vars.registerController("about/contact", function (module: any): Interfaces.IController { return new module.Controller.About.Contact(); });