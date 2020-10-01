import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.About {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/about/index.html", Id: "about-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$aboutUs")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("about/index", function (module: any): Interfaces.IController { return new module.Controller.About.Index(); });