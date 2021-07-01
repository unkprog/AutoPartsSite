import vars = require('app/core/variables');
import base = require('app/controller/about/aboutview');

export namespace Controller.About {
    export class Contact extends base.Controller.About.AboutView {
        constructor() {
            super();
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$contacts"),
                "labelAskQuestion": vars._statres("label$ask$question"),
            });
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/about/contact.html", Id: "contact-view", Page: "/about/contact" };
            return options;
        }

        protected createEvents(): void {
            this.AskButtonClick = this.createTouchClickEvent("contact-view-askq-btn", this.askButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent("contact-view-askq-btn", this.AskButtonClick);
        }

        public AskButtonClick: { (e: any): void; };
        private askButtonClick(e) {
            //vars._app.OpenController({ urlController: "search/askquestion" });
            vars._main.OpenRequest();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

vars.registerController("about/contact", function (module: any): Interfaces.IController { return new module.Controller.About.Contact(); });