import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');
import cms = require('app/services/cmsservice')

export namespace Controller.Basket {
    export class Payment extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
            this.cmsService = new cms.Services.CmsService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }
        private cmsService: cms.Services.CmsService;
        public get CmsService(): cms.Services.CmsService {
            return this.cmsService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/basket/payment.html", Id: "payment-view", Page: "/basket/payment" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$payment"),
                "labelTerms": vars._statres("label$terms"),
                "labelContinueShopping": vars._statres("button$label$continueShopping"),
                "labelTermsConditions": vars._statres("label$termsconditions"),
                "labelPay": vars._statres("button$label$pay"),
                "labelOk": vars._statres("button$label$ok"),
                "IsAcceptTC": false,
                "payCardId": 0
            });
        }

        private loadPayments(): void {
            let self = this;
            self.BasketService.PaymentList((responseData) => {
                if (responseData.Result === 0) {

                    self.destroyPayCardItems();

                    let templateContent = this.View.find('#payment-view-info-type-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: [] = responseData.Data;

                    for (let i = 0, icount = items.length; i < icount; i++) {
                        htmlResult = (htmlResult + template(items[i]));
                    }

                    self.View.find('#payment-view-info').html(htmlResult);
                    self.createCardsItems();
                }
                else
                    vars._app.ShowError(responseData.Error);
            });
        }

        protected OnViewInit(): void {
            this.loadPayments();
        }
     
        protected createEvents(): void {
            this.TermsCondButtonClick = this.createClickEvent("payment-view-terms-btn", this.termsCondButtonClick);
            this.CheckoutButtonClick = this.createClickEvent("payment-checkout-btn", this.checkoutButtonClick);
            this.BackButtonClick = this.createClickEvent("payment-back-btn", this.backButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyPayCardItems();
            this.destroyClickEvent("payment-view-terms-btn", this.TermsCondButtonClick);
            this.destroyClickEvent("payment-back-btn", this.BackButtonClick);
            this.destroyClickEvent("payment-checkout-btn", this.CheckoutButtonClick);
        }

        private proxyPayCardClick;
        private payCardItems: JQuery;
        private createCardsItems() {
            let self = this;
            self.payCardItems = self.View.find('#payment-view-info').find(".pay-card-item");
            if (self.payCardItems) {
                self.proxyPayCardClick = $.proxy(self.payCardClick, self);
                self.payCardItems.on('click', self.proxyPayCardClick);
            }
        }

        private destroyPayCardItems() {
            if (this.payCardItems) this.payCardItems.off('click', this.proxyPayCardClick);
        }


      
        private payCardClick(e: any): boolean {
            let self = this;
            let cur: JQuery = $(e.currentTarget);
            let id: number = cur.data('id');
            self.Model.set("payCardId", id);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public BackButtonClick: { (e: any): void; };
        private backButtonClick(e) {
            vars._app.OpenController({ urlController: "search/index" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }


        public CheckoutButtonClick: { (e: any): void; };
        private checkoutButtonClick(e) {
            if (this.validate() == true) {

            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public TermsCondButtonClick: { (e: any): void; };
        private termsCondButtonClick(e) {
            this.loadTermsConditions();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private validate(): boolean {
            let result: boolean = false;
            if (this.Model.get("payCardId") < 1) {
                M.toast({ html: vars._statres('label$select$paymethod') });
                result = false;
            }
         
            return result;
        }

        protected loadTermsConditions(): boolean {
            let self = this;
            vars._app.ShowLoading(true);

            let options: Interfaces.IControllerPageOptions = this.Options as Interfaces.IControllerPageOptions;
            self.CmsService.Page("/about/termsconditions", (responseData) => {
                if (responseData.Result === 0) {
                    let model: Interfaces.Model.IPage = responseData.Data;
                    self.View.find('#payment-view-modal-content').html(model.Content);
                    if (!this.paymentViewModal)
                        this.paymentViewModal = $('#payment-view-modal').modal();
                    this.paymentViewModal.modal('open');
                }
                else
                    vars._app.ShowError(responseData.Error);
                vars._app.HideLoading();
            });
            return true;
        }
        private paymentViewModal: JQuery;
    }
}

vars.registerController("basket/payment", function (module: any): Interfaces.IController { return new module.Controller.Basket.Payment(); });