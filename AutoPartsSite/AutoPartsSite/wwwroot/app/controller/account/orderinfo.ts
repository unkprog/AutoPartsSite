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
                "labelClose": vars._statres("button$label$close"),

                "labelOrderDate": vars._statres("label$order$date"),
                "labelCurrency": vars._statres("label$currency"),

                "labelBrand": vars._statres("label$brand"),
                "labelPartNumber": vars._statres("label$partnumber"),
                "labelName": vars._statres("label$description"),
                "labelPrice": vars._statres("label$price"),
                "labelQty": vars._statres("label$qty"), 
                "labelSum": vars._statres("label$amount"),
                "labelDeliveryItem": vars._statres("label$delivery"),
                "labelVat": vars._statres("label$vat"),
                "labelTotalSum": vars._statres("label$total"),
                
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
                "Order": {},
                "labelTotalAmount": vars._statres("label$total") + ":",
                "TotalSumValue" : 0

            });
        }


        protected OnViewInit(): void {
            super.OnViewInit();
            let self = this;

            self.AccountService.OrderInfo(vars._appData.OrderId, (responseData) => {
                if (responseData.Result === 0) {
                    self.showOrderInfo(responseData.Data);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        protected createEvents(): void {
            super.createEvents();
            let self = this;
            self.CloseButtonClick = self.createTouchClickEvent("orderinfo-view-btn-close", self.closeButtonClick);
        }

        protected destroyEvents(): void {
            let self = this;
            self.destroyTouchClickEvent("orderinfo-view-btn-close", self.CloseButtonClick);
            super.destroyEvents();
        }

        public CloseButtonClick: { (e: any): void; };
        private closeButtonClick(e) {
            vars._app.ControllerBack(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private showOrderInfo(data: any): void {
            let self = this;
            self.Model.set("Order", data);

            let templateContent = self.View.find('#orderinfo-view-parts-template').html();
            let templateContentTable = self.View.find('#orderinfo-view-parts-table-template').html();
            
            let template = vars.getTemplate(templateContent);
            let templateTable = vars.getTemplate(templateContentTable);

            let items: any[] = data.Items;
            let htmlResult = '', htmlTableResult = '', icount = items.length;
            let totalSum = 0.0;
            for (let i = 0; i < icount; i++) {
                totalSum = totalSum + items[i].TotalAmount;
                
                htmlResult = (htmlResult + template(items[i]));
                htmlTableResult = (htmlTableResult + templateTable(items[i]))
            }
           
            htmlTableResult += '<tr style="font-weight:bold;font-size:1.1rem;">';
            htmlTableResult += '<td colspan="8" class="bold" style="color:rgba(0,0,0,.5);font-size:1.1rem;width:79%;">' + vars._statres("label$items$subtotal") + '</td>';
            htmlTableResult += '<td style="width:9%;">' + window.numberToString(totalSum, 2) + '</td></tr>';

            self.View.find('#orderinfo-view-items-rows').html(htmlResult);
            self.View.find('#orderinfo-view-items-table-rows').html(htmlTableResult);
            self.Model.set('TotalSumValue', window.numberToString(totalSum, 2));

            if (htmlResult !== '') {
                self.rebindModel();
            }
          

            M.updateTextFields();
        }
    

    }
}

vars.registerController("account/orderinfo", function (module: any): Interfaces.IController { return new module.Controller.Account.OrderInfo(); });