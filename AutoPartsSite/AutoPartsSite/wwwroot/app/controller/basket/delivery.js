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
            var Delivery = /** @class */ (function (_super) {
                __extends(Delivery, _super);
                function Delivery() {
                    var _this = _super.call(this) || this;
                    _this.basketService = new bsk.Services.BasketService();
                    return _this;
                }
                Object.defineProperty(Delivery.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Delivery.prototype.createOptions = function () {
                    return { Url: "/app/controller/basket/delivery.html", Id: "delivery-view" };
                };
                Delivery.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$delivery"),
                        "labelPayment": vars._statres("label$payment"),
                        "labelTotalSumValue": 0,
                        "labelTotalSumDelivery": 0,
                        "labelTotalSum": 0
                    });
                };
                Delivery.prototype.OnViewInit = function () {
                };
                Delivery.prototype.createEvents = function () {
                    this.PaymentButtonClick = this.createClickEvent("basket-payment-btn", this.paymentButtonClick);
                };
                Delivery.prototype.destroyEvents = function () {
                    this.destroyClickEvent("basket-payment-btn", this.PaymentButtonClick);
                };
                Delivery.prototype.paymentButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "basket/payment" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                return Delivery;
            }(base.Controller.Base));
            Basket.Delivery = Delivery;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/delivery", function (module) { return new module.Controller.Basket.Delivery(); });
});
//# sourceMappingURL=delivery.js.map