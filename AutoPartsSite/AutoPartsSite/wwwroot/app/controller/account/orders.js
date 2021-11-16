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
            var Orders = (function (_super) {
                __extends(Orders, _super);
                function Orders() {
                    return _super.call(this) || this;
                }
                Orders.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/orders.html", Id: "orders-view", Page: "/account/orders" };
                    return options;
                };
                Orders.prototype.createModel = function () {
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
                };
                Orders.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    this.search(undefined);
                };
                Orders.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                    this.proxyOpenOrder = $.proxy(this.openOrder, this);
                    this.proxyPayOrder = $.proxy(this.payOrder, this);
                };
                Orders.prototype.destroyEvents = function () {
                    this.View.find('#orders-view-parts-table-rows').find('a.order-open').off('click', this.proxyOpenOrder);
                    this.View.find('#orders-view-parts-table-rows').find('a.order-payment').off('click', this.proxyPayOrder);
                    _super.prototype.destroyEvents.call(this);
                };
                Orders.prototype.search = function (e) {
                    var _this = this;
                    var self = this;
                    vars._app.ShowLoading(false);
                    self.View.find('#orders-view-parts-empty').hide();
                    self.View.find('#orders-view-parts-table').hide();
                    self.View.find('#orders-view-parts-table-rows').find('a').off('click', self.proxyOpenOrder);
                    self.AccountService.Orders(function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#orders-view-parts-table-template').html();
                            var template = vars.getTemplate(templateContent);
                            var items = responseData.Data;
                            var htmlResult = '', icount = items.length;
                            if (icount < 1) {
                                self.View.find('#orders-view-parts-empty').hide();
                            }
                            else {
                                for (var i = 0; i < icount; i++) {
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
                };
                Orders.prototype.openOrder = function (e) {
                    var id = $(e.currentTarget).data('id');
                    vars._appData.OrderId = id;
                    vars._app.OpenController({ urlController: 'account/orderinfo', backController: this });
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                Orders.prototype.payOrder = function (e) {
                    var id = $(e.currentTarget).data('id');
                    vars._appData.SetOrderBasket(id, false);
                    vars._app.OpenController({ urlController: 'account/orderpayment', backController: this });
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                return Orders;
            }(acc.Controller.Account.Account));
            Account.Orders = Orders;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/orders", function (module) { return new module.Controller.Account.Orders(); });
});
//# sourceMappingURL=orders.js.map