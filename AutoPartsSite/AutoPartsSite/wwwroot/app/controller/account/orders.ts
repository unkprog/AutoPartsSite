import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Orders extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/orders.html", Id: "orders-view", Page: "/account/orders" };
            return options
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$orders"),
                "labelEmptyOrders": vars._statres("label$order$empty"),
                "labelOrderNumber": vars._statres("label$order$no"),
                "labelOrderDate": vars._statres("label$order$date"),
                "labelCurrency": vars._statres("label$currency"),
                "labelDelivery": vars._statres("label$shipping"),
                "labelComment": vars._statres("label$order$comment"),
                "labelOpenOrder": vars._statres("label$order$open"),
                "labelPayOrder": vars._statres("label$order$payment")


            });
        }


        protected OnViewInit(): void {
            super.OnViewInit();
            this.search(undefined);
        }

        protected createEvents(): void {
            super.createEvents();
            this.proxyOpenOrder = $.proxy(this.openOrder, this);
            this.proxyPayOrder = $.proxy(this.payOrder, this);
        }

        protected destroyEvents(): void {
            this.View.find('#orders-view-parts-table-rows').find('a.order-open').off('click', this.proxyOpenOrder);
            this.View.find('#orders-view-parts-table-rows').find('a.order-payment').off('click', this.proxyPayOrder);
            super.destroyEvents();
        }

        private proxyOpenOrder;
        private proxyPayOrder;
        private search(e: any): boolean {
            let self = this;
           
            vars._app.ShowLoading(false);

            self.View.find('#orders-view-parts-empty').hide();
            self.View.find('#orders-view-parts-table').hide();
            self.View.find('#orders-view-parts-table-rows').find('a').off('click', self.proxyOpenOrder);

            self.AccountService.Orders((responseData) => {
                if (responseData.Result === 0) {
                    let templateContent = this.View.find('#orders-view-parts-table-template').html();
                    let template = vars.getTemplate(templateContent);
                    
                    let items: any[] = responseData.Data;
                    let htmlResult = '', icount = items.length;
                    if (icount < 1) {
                        self.View.find('#orders-view-parts-empty').hide();
                    }
                    else {
                        
                        for (let i = 0; i < icount; i++) {
                            items[i].labelOpenOrder = self.Model.get("labelOpenOrder");
                            items[i].labelPayOrder = self.Model.get("labelPayOrder");
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#orders-view-parts-table').show();

                    }
                    self.View.find('#orders-view-parts-table-rows').html(htmlResult);
                    
                    if (htmlResult !== '') {
                        self.rebindModel();
                    }
                    self.View.find('#orders-view-parts-table-rows').find('a.order-open').on('click', self.proxyOpenOrder);
                    self.View.find('#orders-view-parts-table-rows').find('a.order-payment').on('click', self.proxyPayOrder);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }

        private openOrder(e: any): boolean {
            let id: number = $(e.currentTarget).data('id');
            vars._appData.OrderId = id;
            vars._app.OpenController({ urlController: 'account/orderinfo', backController: this });
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }

        private payOrder(e: any): boolean {
            let id: number = $(e.currentTarget).data('id');
            vars._appData.SetOrderBasket(id, false);
            vars._app.OpenController({ urlController: 'account/orderpayment', backController: this });
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }
    }
}

vars.registerController("account/orders", function (module: any): Interfaces.IController { return new module.Controller.Account.Orders(); });