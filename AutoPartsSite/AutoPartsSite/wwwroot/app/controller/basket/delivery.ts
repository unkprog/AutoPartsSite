import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');

export namespace Controller.Basket {
    export class Delivery extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/basket/delivery.html", Id: "delivery-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$delivery"),
                "labelPayment": vars._statres("label$payment"),
                "labelTotalSumValue": 0,
                "labelTotalSumDelivery": 0,
                "labelTotalSum": 0
            });
        }


        protected OnViewInit(): void {
        }
     
        protected createEvents(): void {
            this.PaymentButtonClick = this.createClickEvent("basket-payment-btn", this.paymentButtonClick);

        }

        protected destroyEvents(): void {
            this.destroyClickEvent("basket-payment-btn", this.PaymentButtonClick);
        }

        public PaymentButtonClick: { (e: any): void; };
        private paymentButtonClick(e) {
            vars._app.OpenController({ urlController: "basket/payment" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

vars.registerController("basket/delivery", function (module: any): Interfaces.IController { return new module.Controller.Basket.Delivery(); });