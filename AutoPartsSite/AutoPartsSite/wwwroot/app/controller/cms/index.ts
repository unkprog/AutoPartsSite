import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.CMS {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/index.html", Id: "cms-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$news")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("cms/index", function (module: any): Interfaces.IController { return new module.Controller.CMS.Index(); });