import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');


export namespace Controller.About {
    export class TermsConditions extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/termsconditions.html", Id: "termsconditions-view", Page: "/about/termsconditions" };
            return options;
        }
    }
}

vars.registerController("about/termsconditions", function (module: any): Interfaces.IController { return new module.Controller.About.TermsConditions(); });