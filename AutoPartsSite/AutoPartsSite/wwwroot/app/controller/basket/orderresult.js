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
            var OrderResult = (function (_super) {
                __extends(OrderResult, _super);
                function OrderResult() {
                    var _this = _super.call(this) || this;
                    _this.basketService = new bsk.Services.BasketService();
                    return _this;
                }
                Object.defineProperty(OrderResult.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                OrderResult.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/basket/orderresult.html", Id: "orderresult-view", Page: "/basket/orderresult" };
                    return options;
                };
                OrderResult.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$order"),
                        "labelContinueShopping": vars._statres("button$label$continueShopping"),
                        "labelOrderSuccess": vars._statres("label$order$success"),
                    });
                };
                OrderResult.prototype.createEvents = function () {
                    this.SearchButtonClick = this.createClickEvent("orderresult-search-btn", this.searchButtonClick);
                };
                OrderResult.prototype.destroyEvents = function () {
                    this.destroyClickEvent("orderresult-search-btn", this.SearchButtonClick);
                };
                OrderResult.prototype.searchButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "search/index" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                return OrderResult;
            }(base.Controller.Base));
            Basket.OrderResult = OrderResult;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/orderresult", function (module) { return new module.Controller.Basket.OrderResult(); });
});
//# sourceMappingURL=orderresult.js.map