import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.Cms {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/index.html", Id: "cms-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "CMS",
                "labelPages": vars._statres("label$site$pages"),
                "labelAbout": vars._statres("label$aboutUs"),
                "labelPayment": vars._statres("label$payment"),
                "labelShipping": vars._statres("label$shipping"),
                "labelContacts": vars._statres("label$contacts"),

                "labelNewsFaq": vars._statres("label$news") + ', ' + vars._statres("label$faq"),
                "labelNews": vars._statres("label$news"),
                "labelFaq": vars._statres("label$faq")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("cms/index", function (module: any): Interfaces.IController { return new module.Controller.Cms.Index(); });