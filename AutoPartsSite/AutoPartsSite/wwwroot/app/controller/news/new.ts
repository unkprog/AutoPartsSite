import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.News {
    export class New extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/news/new.html", Id: "new-view" };
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

vars.registerController("news/new", function (module: any): Interfaces.IController { return new module.Controller.News.New(); });