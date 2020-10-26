import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');

export namespace Controller.About {
    export class Index extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/index.html", Id: "about-view", Page: "/about/index" };
            return options;
        }
    }
}

vars.registerController("about/index", function (module: any): Interfaces.IController { return new module.Controller.About.Index(); });