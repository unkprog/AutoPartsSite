import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.Search {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/search/index.html", Id: "search-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("button$label$find"),
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("search/index", function (module: any): Interfaces.IController { return new module.Controller.Search.Index(); });