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
                "labelTotalSumValue": 0,
                "labelTotalSumDelivery": 0,
                "labelTotalSum": 0
            });
        }


        protected OnViewInit(): void {
        }
     
        protected createEvents(): void {
        }

        protected destroyEvents(): void {
        }

    }
}

vars.registerController("basket/payment", function (module: any): Interfaces.IController { return new module.Controller.Basket.Payment(); });