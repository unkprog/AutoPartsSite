import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');


export namespace Controller.About {
    export class Policies extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/policies.html", Id: "policies-view", Page: "/about/policies" };
            return options;
        }
    }
}

vars.registerController("about/policies", function (module: any): Interfaces.IController { return new module.Controller.About.Policies(); });