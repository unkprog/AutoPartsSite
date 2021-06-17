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
        var Basket;
        (function (Basket) {
            var Payment = /** @class */ (function (_super) {
                __extends(Payment, _super);
                function Payment() {
                    var _this = _super.call(this) || this;
                    _this.basketService = new bsk.Services.BasketService();
                    _this.cmsService = new cms.Services.CmsService();
                    return _this;
                }
                Object.defineProperty(Payment.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Payment.prototype, "CmsService", {
                    get: function () {
                        return this.cmsService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Payment.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/basket/payment.html", Id: "payment-view", Page: "/basket/payment" };
                    return options;
                };
                Payment.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$payment"),
                        "labelTerms": vars._statres("label$terms"),
                        "labelBack": vars._statres("label$back"),
                        "labelCheckout": vars._statres("button$label$сheckout"),
                        "labelTermsConditions": vars._statres("label$termsconditions"),
                        "labelOk": vars._statres("button$label$ok"),
                        "IsAcceptTC": false,
                        "payCardId": 0
                    });
                };
                Payment.prototype.loadPayments = function () {
                    var _this = this;
                    var self = this;
                    self.BasketService.PaymentList(function (responseData) {
                        if (responseData.Result === 0) {
                            self.destroyPayCardItems();
                            var templateContent = _this.View.find('#payment-view-info-type-template').html();
                            var template = vars.getTemplate(templateContent);
                            var htmlResult = '';
                            var items = responseData.Data;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#payment-view-info').html(htmlResult);
                            self.createCardsItems();
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                };
                Payment.prototype.OnViewInit = function () {
                    this.loadPayments();
                };
                Payment.prototype.createEvents = function () {
                    this.TermsCondButtonClick = this.createClickEvent("payment-view-terms-btn", this.termsCondButtonClick);
                    this.CheckoutButtonClick = this.createClickEvent("payment-checkout-btn", this.checkoutButtonClick);
                    this.BackButtonClick = this.createClickEvent("payment-back-btn", this.backButtonClick);
                };
                Payment.prototype.destroyEvents = function () {
                    this.destroyPayCardItems();
                    this.destroyClickEvent("payment-view-terms-btn", this.TermsCondButtonClick);
                    this.destroyClickEvent("payment-back-btn", this.BackButtonClick);
                    this.destroyClickEvent("payment-checkout-btn", this.CheckoutButtonClick);
                };
                Payment.prototype.createCardsItems = function () {
                    var self = this;
                    self.payCardItems = self.View.find('#payment-view-info').find(".pay-card-item");
                    if (self.payCardItems) {
                        self.proxyPayCardClick = $.proxy(self.payCardClick, self);
                        self.payCardItems.on('click', self.proxyPayCardClick);
                    }
                };
                Payment.prototype.destroyPayCardItems = function () {
                    if (this.payCardItems)
                        this.payCardItems.off('click', this.proxyPayCardClick);
                };
                Payment.prototype.payCardClick = function (e) {
                    var self = this;
                    var cur = $(e.currentTarget);
                    var id = cur.data('id');
                    self.Model.set("payCardId", id);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Payment.prototype.backButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "basket/billing" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Payment.prototype.checkoutButtonClick = function (e) {
                    if (this.validate() == true) {
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Payment.prototype.termsCondButtonClick = function (e) {
                    this.loadTermsConditions();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Payment.prototype.validate = function () {
                    var result = false;
                    if (this.Model.get("payCardId") < 1) {
                        M.toast({ html: vars._statres('label$select$paymethod') });
                        result = false;
                    }
                    return result;
                };
                Payment.prototype.loadTermsConditions = function () {
                    var _this = this;
                    var self = this;
                    vars._app.ShowLoading(true);
                    var options = this.Options;
                    self.CmsService.Page("/about/termsconditions", function (responseData) {
                        if (responseData.Result === 0) {
                            var model = responseData.Data;
                            self.View.find('#payment-view-modal-content').html(model.Content);
                            if (!_this.paymentViewModal)
                                _this.paymentViewModal = $('#payment-view-modal').modal();
                            _this.paymentViewModal.modal('open');
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                        vars._app.HideLoading();
                    });
                    return true;
                };
                return Payment;
            }(base.Controller.Base));
            Basket.Payment = Payment;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/payment", function (module) { return new module.Controller.Basket.Payment(); });
});
//# sourceMappingURL=payment.js.map