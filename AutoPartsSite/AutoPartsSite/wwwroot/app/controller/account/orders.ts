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
                "Header": vars._statres("label$orders")
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
            this.View.find('#order-view-items').find('a').off('click', this.proxyOpenOrder);
            super.destroyEvents();
        }

        private proxyOpenOrder;
        private search(e: any): boolean {
            let self = this;
            let newSrch: string = '';

            vars._app.ShowLoading(false);


            self.View.find('#order-view-items').find('a').off('click', self.proxyOpenOrder);

            self.AccountService.Orders((responseData) => {
                if (responseData.Result === 0) {
                    let templateContent = this.View.find('#new-view-item-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: any[] = responseData.Data;
                    for (let i = 0, icount = items.length; i < icount; i++) {
                        htmlResult = (htmlResult + template(items[i]));
                    }

                    self.View.find('#order-view-items').html(htmlResult);

                    if (htmlResult !== '') {
                        self.rebindModel();
                    }
                    self.View.find('#order-view-items').find('a').on('click', self.proxyOpenOrder);
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