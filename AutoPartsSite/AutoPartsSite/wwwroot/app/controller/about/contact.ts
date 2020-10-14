import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.About {
    export class Contact extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/about/contact.html", Id: "contact-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$contacts")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("about/contact", function (module: any): Interfaces.IController { return new module.Controller.About.Contact(); });