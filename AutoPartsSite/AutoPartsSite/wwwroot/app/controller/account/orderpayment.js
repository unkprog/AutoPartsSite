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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/basketservice", "app/services/cmsservice"], function (require, exports, vars, base, bsk, cms) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var OrderPayment = (function (_super) {
                __extends(OrderPayment, _super);
                function OrderPayment() {
                    var _this = _super.call(this) || this;
                    _this.basketService = new bsk.Services.BasketService();
                    _this.cmsService = new cms.Services.CmsService();
                    return _this;
                }
                Object.defineProperty(OrderPayment.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(OrderPayment.prototype, "CmsService", {
                    get: function () {
                        return this.cmsService;
                    },
                    enumerable: false,
                    configurable: true
                });
                OrderPayment.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/orderpayment.html", Id: "orderpayment-view", Page: "/account/orderpayment" };
                    return options;
                };
                OrderPayment.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$payment"),
                        "labelTerms": vars._statres("label$terms"),
                        "labelContinueShopping": vars._statres("button$label$continueShopping"),
                        "labelTermsConditions": vars._statres("label$termsconditions"),
                        "labelPay": vars._statres("button$label$pay"),
                        "labelOk": vars._statres("button$label$ok"),
                        "labelBack": vars._statres("label$back"),
                        "IsAcceptTC": false,
                        "payCardId": 0,
                        "orderId": 0,
                        "isBasketCheckOut": false,
                        "isOrderCheckOut": true,
                    });
                };
                OrderPayment.prototype.loadPayments = function () {
                    var self = this;
                    self.BasketService.PaymentList(function (responseData) {
                        if (responseData.Result === 0) {
                            self.destroyPayCardItems();
                            var templateContent = self.View.find('#orderpayment-view-info-type-template').html();
                            var template = vars.getTemplate(templateContent);
                            var htmlResult = '';
                            var items = responseData.Data;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#orderpayment-view-info').html(htmlResult);
                            self.createCardsItems();
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                };
                OrderPayment.prototype.OnViewInit = function () {
                    this.Model.set("orderId", vars._appData.OrderId);
                    this.Model.set("isBasketCheckOut", vars._appData.IsBasketCheckOut);
                    this.Model.set("isOrderCheckOut", vars._appData.IsBasketCheckOut === false);
                    this.loadPayments();
                };
                OrderPayment.prototype.createEvents = function () {
                    this.TermsCondButtonClick = this.createClickEvent("orderpayment-view-terms-btn", this.termsCondButtonClick);
                    this.CheckoutButtonClick = this.createClickEvent("orderpayment-checkout-btn", this.checkoutButtonClick);
                    this.BackButtonClick = this.createClickEvent("orderpayment-back-btn", this.backButtonClick);
                };
                OrderPayment.prototype.destroyEvents = function () {
                    this.destroyPayCardItems();
                    this.destroyClickEvent("orderpayment-view-terms-btn", this.TermsCondButtonClick);
                    this.destroyClickEvent("orderpayment-back-btn", this.BackButtonClick);
                    this.destroyClickEvent("orderpayment-checkout-btn", this.CheckoutButtonClick);
                };
                OrderPayment.prototype.createCardsItems = function () {
                    var self = this;
                    self.Model.set("orderId", vars._appData.OrderId);
                    self.Model.set("isBasketCheckOut", vars._appData.IsBasketCheckOut);
                    self.payCardItems = self.View.find('#orderpayment-view-info').find(".pay-card-item-row");
                    if (self.payCardItems) {
                        self.proxyPayCardClick = $.proxy(self.payCardClick, self);
                        self.payCardItems.on('click', self.proxyPayCardClick);
                    }
                };
                OrderPayment.prototype.destroyPayCardItems = function () {
                    if (this.payCardItems)
                        this.payCardItems.off('click', this.proxyPayCardClick);
                };
                OrderPayment.prototype.payCardClick = function (e) {
                    var self = this;
                    var cur = $(e.currentTarget);
                    var id = cur.data('id');
                    self.Model.set("payCardId", id);
                    $('.pay-card-item-row').removeClass('card-delivery-item-row-selected');
                    $("#pay-card-" + id).addClass('card-delivery-item-row-selected');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                OrderPayment.prototype.backButtonClick = function (e) {
                    if (vars._appData.PayOrderType === 1)
                        vars._app.OpenController({ urlController: "account/orderinfo" });
                    else
                        vars._app.OpenController({ urlController: "account/orders" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                OrderPayment.prototype.checkoutButtonClick = function (e) {
                    var self = this;
                    if (self.validate() == true) {
                        self.BasketService.CreateOrder(function (responseData) {
                            if (responseData.Result === 0) {
                                if (responseData.Data == "Ok") {
                                }
                                else
                                    M.toast({ html: responseData.Data });
                            }
                            else
                                vars._app.ShowError(responseData.Error);
                        });
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                OrderPayment.prototype.termsCondButtonClick = function (e) {
                    this.loadTermsConditions();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                OrderPayment.prototype.validate = function () {
                    var result = true;
                    if (this.Model.get("payCardId") < 1) {
                        M.toast({ html: vars._statres('label$select$paymethod') });
                        result = false;
                    }
                    return result;
                };
                OrderPayment.prototype.loadTermsConditions = function () {
                    var _this = this;
                    var self = this;
                    vars._app.ShowLoading(true);
                    var options = this.Options;
                    self.CmsService.Page("/about/termsconditions", function (responseData) {
                        if (responseData.Result === 0) {
                            var model = responseData.Data;
                            self.View.find('#orderpayment-view-modal-content').html(model.Content);
                            if (!_this.paymentViewModal)
                                _this.paymentViewModal = $('#orderpayment-view-modal').modal();
                            _this.paymentViewModal.modal('open');
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                        vars._app.HideLoading();
                    });
                    return true;
                };
                return OrderPayment;
            }(base.Controller.Base));
            Account.OrderPayment = OrderPayment;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/orderpayment", function (module) { return new module.Controller.Account.OrderPayment(); });
});
//# sourceMappingURL=orderpayment.js.map