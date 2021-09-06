﻿import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Messages extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/messages.html", Id: "messages-view", Page: "/account/messages" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$messages")
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            this.search(undefined);
        }

        protected createEvents(): void {
            super.createEvents();
            this.proxyOpenMessage = $.proxy(this.openMessage, this);
        }

        protected destroyEvents(): void {
            this.View.find('#orders-view-parts-table-rows').find('a').off('click', this.proxyOpenMessage);
            super.destroyEvents();
        }

        private proxyOpenMessage;
        private search(e: any): boolean {
            let self = this;

            vars._app.ShowLoading(false);

            //self.View.find('#orders-view-parts-empty').hide();
            //self.View.find('#orders-view-parts-table').hide();
            //self.View.find('#orders-view-parts-table-rows').find('a').off('click', self.proxyOpenMessage);

            self.AccountService.Orders((responseData) => {
                if (responseData.Result === 0) {
                    //let templateContent = this.View.find('#orders-view-parts-table-template').html();
                    //let template = vars.getTemplate(templateContent);

                    //let items: any[] = responseData.Data;
                    //let htmlResult = '', icount = items.length;
                    //if (icount < 1) {
                    //    self.View.find('#orders-view-parts-empty').show();
                    //}
                    //else {

                    //    for (let i = 0; i < icount; i++) {
                    //        htmlResult = (htmlResult + template(items[i]));
                    //    }
                    //    self.View.find('#orders-view-parts-table').show();

                    //}
                    //self.View.find('#orders-view-parts-table-rows').html(htmlResult);

                    //if (htmlResult !== '') {
                    //    self.rebindModel();
                    //}
                    //self.View.find('#orders-view-parts-table-rows').find('a').on('click', self.proxyOpenMessage);
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

        private openMessage(e: any): boolean {
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

vars.registerController("account/messages", function (module: any): Interfaces.IController { return new module.Controller.Account.Messages(); });