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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/basketservice"], function (require, exports, vars, base, bsk) {
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
                    return _this;
                }
                Object.defineProperty(Payment.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Payment.prototype.createOptions = function () {
                    return { Url: "/app/controller/basket/payment.html", Id: "payment-view" };
                };
                Payment.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$payment"),
                        "labelTerms": vars._statres("label$terms"),
                        "labelBack": vars._statres("label$back"),
                        "labelCheckout": vars._statres("button$label$сheckout"),
                    });
                };
                Payment.prototype.loadPayments = function () {
                    var _this = this;
                    var self = this;
                    self.BasketService.PaymentList(function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#payment-view-info-type-template').html();
                            var template = vars.getTemplate(templateContent);
                            var htmlResult = '';
                            var items = responseData.Data;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#payment-view-info').html(htmlResult);
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                };
                Payment.prototype.OnViewInit = function () {
                    this.loadPayments();
                };
                Payment.prototype.createEvents = function () {
                    this.CheckoutButtonClick = this.createClickEvent("payment-checkout-btn", this.checkoutButtonClick);
                    this.BackButtonClick = this.createClickEvent("payment-back-btn", this.backButtonClick);
                };
                Payment.prototype.destroyEvents = function () {
                    this.destroyClickEvent("payment-back-btn", this.BackButtonClick);
                    this.destroyClickEvent("payment-checkout-btn", this.CheckoutButtonClick);
                };
                Payment.prototype.backButtonClick = function (e) {
                    //vars._app.ControllerBack(e);
                    vars._app.OpenController({ urlController: "basket/billing" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Payment.prototype.checkoutButtonClick = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Payment.prototype.validate = function (model) {
                    var result = false;
                    return result;
                };
                return Payment;
            }(base.Controller.Base));
            Basket.Payment = Payment;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/payment", function (module) { return new module.Controller.Basket.Payment(); });
});
//# sourceMappingURL=payment.js.map