import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');
import utils = require('app/core/utils');

export namespace Controller.Basket {
    export class OrderResult extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/basket/orderresult.html", Id: "orderresult-view", Page: "/basket/orderresult" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$order"),
                "labelContinueShopping": vars._statres("button$label$continueShopping"),
                "labelOrderSuccess": vars._statres("label$order$success"),
            });
        }

        protected createEvents(): void {
            this.SearchButtonClick = this.createClickEvent("orderresult-search-btn", this.searchButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("orderresult-search-btn", this.SearchButtonClick);
        }

        public SearchButtonClick: { (e: any): void; };
        private searchButtonClick(e) {
            vars._app.OpenController({ urlController: "search/index" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

    }
}

vars.registerController("basket/orderresult", function (module: any): Interfaces.IController { return new module.Controller.Basket.OrderResult(); });