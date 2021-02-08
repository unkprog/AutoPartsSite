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
                        "Header": vars._statres("label$address$delivery"),
                        "labelBack": vars._statres("label$back"),
                        "labelCheckout": vars._statres("button$label$сheckout"),
                    });
                };
                Delivery.prototype.ViewInit = function (view) {
                    _super.prototype.ViewInit.call(this, view);
                    return false;
                };
                Delivery.prototype.OnViewInit = function () {
                    vars._app.ShowLoading(true);
                    var self = this;
                    this.BasketService.DeliveryData(function (responseData) {
                        if (responseData.Result === 0) {
                            self.setupDeliveryData(responseData);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                Delivery.prototype.setupDeliveryData = function (responseData) {
                    var settings = vars._appData.Settings;
                    var countries = responseData.Data;
                    var html = '';
                    for (var i = 0, icount = countries.length; i < icount; i++) {
                        html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                        html = html + countries[i].Code + ' - ' + countries[i].Name + '</option>';
                    }
                    $('#delivery-view-country').html(html);
                    this.View.find('select').formSelect();
                };
                Delivery.prototype.createEvents = function () {
                    this.CheckoutButtonClick = this.createClickEvent("delivery-checkout-btn", this.checkoutButtonClick);
                    this.BackButtonClick = this.createClickEvent("delivery-back-btn", this.backButtonClick);
                };
                Delivery.prototype.destroyEvents = function () {
                    this.destroyClickEvent("delivery-back-btn", this.BackButtonClick);
                    this.destroyClickEvent("delivery-checkout-btn", this.CheckoutButtonClick);
                };
                Delivery.prototype.backButtonClick = function (e) {
                    //vars._app.ControllerBack(e);
                    vars._app.OpenController({ urlController: "basket/index" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Delivery.prototype.checkoutButtonClick = function (e) {
                    //let delivery: Interfaces.Model.IBasketDeilvery;
                    //if (this.validate(delivery)) {
                    //    this.BasketService.SetDelivery(delivery, (responseData) => {
                    //        if (responseData.Result === 0) {
                    //            vars._app.OpenController({ urlController: "basket/billing" });
                    //        }
                    //        else {
                    //            vars._app.ShowError(responseData.Error);
                    //        }
                    //        vars._app.HideLoading();
                    //    });
                    //}
                    vars._app.OpenController({ urlController: "basket/billing" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Delivery.prototype.validate = function (delivery) {
                    var result = false;
                    return result;
                };
                return Delivery;
            }(base.Controller.Base));
            Basket.Delivery = Delivery;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/delivery", function (module) { return new module.Controller.Basket.Delivery(); });
});
//# sourceMappingURL=delivery.js.map