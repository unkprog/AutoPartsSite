import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');

export namespace Controller.Basket {
    export class Payment extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/basket/payment.html", Id: "payment-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$payment"),
                "labelTerms": vars._statres("label$terms"),
                "labelBack": vars._statres("label$back"),
                "labelCheckout": vars._statres("button$label$сheckout"),
            });
        }

        private loadPayments(): void {
            let self = this;
            self.BasketService.PaymentList((responseData) => {
                if (responseData.Result === 0) {

                    let templateContent = this.View.find('#payment-view-info-type-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: [] = responseData.Data;

                    for (let i = 0, icount = items.length; i < icount; i++) {
                        htmlResult = (htmlResult + template(items[i]));
                    }

                    self.View.find('#payment-view-info').html(htmlResult);
                }
                else
                    vars._app.ShowError(responseData.Error);
            });
        }

        protected OnViewInit(): void {
            this.loadPayments();
        }
     
        protected createEvents(): void {
            this.CheckoutButtonClick = this.createClickEvent("payment-checkout-btn", this.checkoutButtonClick);
            this.BackButtonClick = this.createClickEvent("payment-back-btn", this.backButtonClick);


        }

        protected destroyEvents(): void {
            this.destroyClickEvent("payment-back-btn", this.BackButtonClick);
            this.destroyClickEvent("payment-checkout-btn", this.CheckoutButtonClick);
        }

        public BackButtonClick: { (e: any): void; };
        private backButtonClick(e) {
            //vars._app.ControllerBack(e);
            vars._app.OpenController({ urlController: "basket/billing" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }


        public CheckoutButtonClick: { (e: any): void; };
        private checkoutButtonClick(e) {
            
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private validate(model: Interfaces.Model.IDeliveryAddressInfo): boolean {
            let result: boolean = false;

         
            return result;
        }

    }
}

vars.registerController("basket/payment", function (module: any): Interfaces.IController { return new module.Controller.Basket.Payment(); });