import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Addresses extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/addresses.html", Id: "addresses-view", Page: "/account/addresses" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$addresses"),
                "labelEmptyAddresses": vars._statres("label$addresses$empty"),

                "labelBilling": vars._statres("label$address$billing"),
                "labelDelivery": vars._statres("label$address$delivery"),

                "labelFullName": vars._statres("label$fullname"),
                "labelCountry": vars._statres("label$country"),
                "labelRegion": vars._statres("label$region"),
                "labelCity": vars._statres("label$city"),
                "labelZipCode": vars._statres("label$zipcode"),
                "labelStreet": vars._statres("label$address"),
                "labelPhoneCode": vars._statres("label$phonecode"),
                "labelPhone": vars._statres("label$phone"),
                "labelEmail": vars._statres("label$email"),
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            this.search(undefined);
        }

        protected createEvents(): void {
            super.createEvents();
            this.proxyOpenMessage = $.proxy(this.openAddress, this);
        }

        protected destroyEvents(): void {
            this.View.find('#orders-view-parts-table-rows').find('.message-view-item').off('click', this.proxyOpenMessage);
            super.destroyEvents();
        }

        private proxyOpenMessage;
        private search(e: any): boolean {
            let self = this;

            vars._app.ShowLoading(false);

            self.View.find('#addresses-view-parts-empty').hide();
            self.View.find('#addresses-view-parts-rows').hide();
            self.View.find('#addresses-view-parts-rows').find('.message-view-item').off('click', self.proxyOpenMessage);

            self.AccountService.GetAddresses((responseData) => {
                if (responseData.Result === 0) {
                    let templateContent = this.View.find('#addresses-view-parts-table-template').html();
                    let template = vars.getTemplate(templateContent);

                    let items: any[] = responseData.Data;
                    let htmlResult = '', icount = items.length;
                    if (icount < 1) {
                        self.View.find('#addresses-view-parts-empty').show();
                    }
                    else {

                        for (let i = 0; i < icount; i++) {
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#addresses-view-parts-rows').show();

                    }
                    self.View.find('#addresses-view-parts-rows').html(htmlResult);

                    if (htmlResult !== '') {
                        self.rebindModel();
                    }
                    self.View.find('#addresses-view-parts-rows').find('.message-view-item').on('click', self.proxyOpenMessage);
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

        private openAddress(e: any): boolean {
            let id: number = $(e.currentTarget).data('id');
            vars._appData.AddressId = id;
            //vars._app.OpenController({ urlController: 'account/messageinfo', backController: this });
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }
    }
}

vars.registerController("account/addresses", function (module: any): Interfaces.IController { return new module.Controller.Account.Addresses(); });