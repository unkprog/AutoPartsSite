import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.About {
    export class Shipping extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/about/shipping.html", Id: "shipping-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$shipping")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("about/shipping", function (module: any): Interfaces.IController { return new module.Controller.About.Shipping(); });