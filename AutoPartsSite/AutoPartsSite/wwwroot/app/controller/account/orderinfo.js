var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var OrderInfo = (function (_super) {
                __extends(OrderInfo, _super);
                function OrderInfo() {
                    return _super.call(this) || this;
                }
                OrderInfo.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/orderinfo.html", Id: "orderinfo-view", Page: "/account/orderinfo" };
                    return options;
                };
                OrderInfo.prototype.createModel = function () {
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
                        "TotalSumValue": 0,
                        "labelPay": vars._statres("button$label$pay"),
                        "isOrderCheckOut": false,
                    });
                };
                OrderInfo.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    var self = this;
                    self.AccountService.OrderInfo(vars._appData.OrderId, function (responseData) {
                        if (responseData.Result === 0) {
                            self.showOrderInfo(responseData.Data);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                OrderInfo.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                    var self = this;
                    self.PayOrderButtonClick = self.createTouchClickEvent("orderinfo-checkout-btn", self.payOrderButtonClick);
                    self.CloseButtonClick = self.createTouchClickEvent("orderinfo-view-btn-close", self.closeButtonClick);
                };
                OrderInfo.prototype.destroyEvents = function () {
                    var self = this;
                    self.destroyTouchClickEvent("orderinfo-checkout-btn", self.PayOrderButtonClick);
                    self.destroyTouchClickEvent("orderinfo-view-btn-close", self.CloseButtonClick);
                    _super.prototype.destroyEvents.call(this);
                };
                OrderInfo.prototype.payOrderButtonClick = function (e) {
                    vars._appData.SetOrderBasket(vars._appData.OrderId, 1, false);
                    vars._app.OpenController({ urlController: 'account/orderpayment', backController: this });
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                OrderInfo.prototype.closeButtonClick = function (e) {
                    vars._app.ControllerBack(e);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                OrderInfo.prototype.showOrderInfo = function (data) {
                    var self = this;
                    self.Model.set("Order", data);
                    self.Model.set("isOrderCheckOut", true);
                    var templateContent = self.View.find('#orderinfo-view-parts-template').html();
                    var templateContentTable = self.View.find('#orderinfo-view-parts-table-template').html();
                    var template = vars.getTemplate(templateContent);
                    var templateTable = vars.getTemplate(templateContentTable);
                    var items = data.Items;
                    var htmlResult = '', htmlTableResult = '', icount = items.length;
                    var totalSum = 0.0;
                    for (var i = 0; i < icount; i++) {
                        totalSum = totalSum + items[i].TotalAmount;
                        htmlResult = (htmlResult + template(items[i]));
                        htmlTableResult = (htmlTableResult + templateTable(items[i]));
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
                };
                return OrderInfo;
            }(acc.Controller.Account.Account));
            Account.OrderInfo = OrderInfo;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/orderinfo", function (module) { return new module.Controller.Account.OrderInfo(); });
});
//# sourceMappingURL=orderinfo.js.map