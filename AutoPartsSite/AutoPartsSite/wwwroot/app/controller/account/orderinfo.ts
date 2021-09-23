import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class OrderInfo extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/orderinfo.html", Id: "orderinfo-view", Page: "/account/orderinfo" };
            return options
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$order"),
                "labelEmptyOrders": vars._statres("label$order$empty"),
                "labelOrderNumber": vars._statres("label$order$no"),
                "labelOrderDate": vars._statres("label$order$date"),
                "labelCurrency": vars._statres("label$currency"),
                "labelDelivery": vars._statres("label$shipping"),
                "labelComment": vars._statres("label$order$comment"),
                "labelOpenOrder": vars._statres("label$order$open"),


            });
        }


        protected OnViewInit(): void {
            super.OnViewInit();
            let self = this;
            self.AccountService.Orders((responseData) => {
                if (responseData.Result === 0) {
                    self.showOrder(responseData.Data);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        protected createEvents(): void {
            super.createEvents();
            
        }

        protected destroyEvents(): void {
            
            super.destroyEvents();
        }


        private showOrder(e: any): void {
        }
    

    }
}

vars.registerController("account/orderinfo", function (module: any): Interfaces.IController { return new module.Controller.Account.OrderInfo(); });