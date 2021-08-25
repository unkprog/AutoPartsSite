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
                "labelComment": vars._statres("label$order$comment"),
                "labelOpenOrder": vars._statres("label$order$open"),

            });
        }


        protected OnViewInit(): void {
            super.OnViewInit();
            this.search(undefined);
        }

        protected createEvents(): void {
            super.createEvents();
            this.proxyOpenOrder = $.proxy(this.openOrder, this);
        }

        protected destroyEvents(): void {
            this.View.find('#orders-view-parts-table-rows').find('a').off('click', this.proxyOpenOrder);
            super.destroyEvents();
        }

        private proxyOpenOrder;
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
                        self.View.find('#orders-view-parts-empty').show();
                    }
                    else {
                        
                        for (let i = 0; i < icount; i++) {
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#orders-view-parts-table').show();

                    }
                    self.View.find('#orders-view-parts-table-rows').html(htmlResult);
                    
                    if (htmlResult !== '') {
                        self.rebindModel();
                    }
                    self.View.find('#orders-view-parts-table-rows').find('a').on('click', self.proxyOpenOrder);
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
            //vars._appData.NewViewItemId = id;
            //vars._app.OpenController({ urlController: 'news/new', backController: this });
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }
    }
}

vars.registerController("account/orders", function (module: any): Interfaces.IController { return new module.Controller.Account.Orders(); });