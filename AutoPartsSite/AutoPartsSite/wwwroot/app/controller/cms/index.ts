import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import utils = require('app/core/utils');

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
            this.AboutButtonClick = this.createClickEvent("cms-view-btn-about", this.aboutButtonClick);
            this.PaymentButtonClick = this.createClickEvent("cms-view-btn-payment", this.paymentButtonClick);
            this.ShippingButtonClick = this.createClickEvent("cms-view-btn-shipping", this.shippingButtonClick);
            this.ContactsButtonClick = this.createClickEvent("cms-view-btn-contacts", this.contactsButtonClick);

            this.NewsButtonClick = this.createClickEvent("cms-view-btn-news", this.newsButtonClick);
            this.FaqButtonClick = this.createClickEvent("cms-view-btn-faq", this.faqButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("cms-view-btn-faq", this.FaqButtonClick);
            this.destroyClickEvent("cms-view-btn-news", this.NewsButtonClick);

            this.destroyClickEvent("cms-view-btn-contacts", this.ContactsButtonClick);
            this.destroyClickEvent("cms-view-btn-shipping", this.ShippingButtonClick);
            this.destroyClickEvent("cms-view-btn-payment", this.PaymentButtonClick);
            this.destroyClickEvent("cms-view-btn-about", this.AboutButtonClick);
        }

        public AboutButtonClick: { (e: any): void; };
        private aboutButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/index", "label$aboutUs");
        }

        public PaymentButtonClick: { (e: any): void; };
        private paymentButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/payment", "label$payment");
        }

        public ShippingButtonClick: { (e: any): void; };
        private shippingButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/shipping", "label$shipping");
        }

        public ContactsButtonClick: { (e: any): void; };
        private contactsButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/contact", "label$contacts");
        }

        public FaqButtonClick: { (e: any): void; };
        private faqButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/faq", "label$faq")
        }

        public PoliciesButtonClick: { (e: any): void; };
        private policiesButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/policies", "label$policies")
        }

        public TermsConditionsButtonClick: { (e: any): void; };
        private termsConditionsButtonClick(e: any): boolean {
            return this.handleButtonItemPage(e, 'cms/editor/page', "/about/termsconditions", "label$termsconditions")
        }

        public NewsButtonClick: { (e: any): void; };
        private newsButtonClick(e: any): boolean {
            return this.handleButtonItem(e, 'cms/card/new');
        }

        private handleButtonItemPage(e: any, urlController: string, pageEditItem: string, pageEditItemHeader: string) {
            vars._appData.PageEditItem = pageEditItem;
            vars._appData.PageEditItemHeader = pageEditItemHeader;
            return this.handleButtonItem(e, urlController);
        }

        private handleButtonItem(e: any, urlController: string): boolean {
            if (!utils.isNullOrEmpty(urlController))
                vars._app.OpenController({ urlController: urlController, backController: this });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

vars.registerController("cms/index", function (module: any): Interfaces.IController { return new module.Controller.Cms.Index(); });