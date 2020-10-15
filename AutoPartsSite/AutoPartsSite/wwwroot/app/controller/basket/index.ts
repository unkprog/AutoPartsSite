import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');

export namespace Controller.Basket {
    export class Index extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/basket/index.html", Id: "basket-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$basket")
            });
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("basket/index", function (module: any): Interfaces.IController { return new module.Controller.Basket.Index(); });