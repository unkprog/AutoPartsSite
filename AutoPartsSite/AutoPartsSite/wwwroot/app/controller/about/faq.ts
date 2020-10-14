import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.About {
    export class Faq extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/about/faq.html", Id: "faq-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$faq")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("about/faq", function (module: any): Interfaces.IController { return new module.Controller.About.Faq(); });