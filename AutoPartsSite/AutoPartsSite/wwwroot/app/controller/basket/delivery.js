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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/basketservice", "app/core/utils"], function (require, exports, vars, base, bsk, utils) {
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
                    var options = { Url: "/app/controller/basket/delivery.html", Id: "delivery-view", Page: "/basket/delivery" };
                    return options;
                };
                Delivery.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$address$delivery"),
                        "labelBack": vars._statres("label$back"),
                        "labelCheckout": vars._statres("button$label$сheckout"),
                        "labelFullName": vars._statres("label$fullname"),
                        "labelCountry": vars._statres("label$country"),
                        "labelRegion": vars._statres("label$region"),
                        "labelCity": vars._statres("label$city"),
                        "labelZipCode": vars._statres("label$zipcode"),
                        "labelStreet": vars._statres("label$address"),
                        "labelPhoneCode": vars._statres("label$phonecode"),
                        "labelPhone": vars._statres("label$phone"),
                        "DeliveryAddress": {}
                    });
                };
                Delivery.prototype.ViewInit = function (view) {
                    _super.prototype.ViewInit.call(this, view);
                    return false;
                };
                Delivery.prototype.OnViewInit = function () {
                    //vars._app.ShowLoading(true);
                    var self = this;
                    this.BasketService.DeliveryAddressData(function (responseData) {
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
                    var countries = responseData.Data.Countries;
                    this.Model.set("DeliveryAddress", responseData.Data.DeliveryAddress);
                    var html = '';
                    for (var i = 0, icount = countries.length; i < icount; i++) {
                        if (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase())
                            this.Model.set("DeliveryAddress.CountryId", countries[i].Id);
                        html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                        html = html + countries[i].Code + ' - ' + countries[i].Name + '</option>';
                    }
                    $('#delivery-view-country').html(html);
                    this.View.find('select').formSelect();
                    M.updateTextFields();
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
                    var delivery = this.Model.get("DeliveryAddress").toJSON();
                    if (this.validate(delivery)) {
                        this.BasketService.SetDeliveryAddressData(delivery, function (responseData) {
                            if (responseData.Result === 0) {
                                vars._app.OpenController({ urlController: "basket/billing" });
                            }
                            else {
                                vars._app.ShowError(responseData.Error);
                            }
                            vars._app.HideLoading();
                        });
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Delivery.prototype.validate = function (model) {
                    var result = true;
                    if (utils.isNullOrEmpty(model.FullName)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$fullname') });
                        result = false;
                    }
                    if (utils.isNull(model.CountryId) || model.CountryId == 0) {
                        M.toast({ html: vars._statres('msg$error$notspecified$country') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.Region)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$region') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.City)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$city') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.ZipCode)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$zipcode') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.Street)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$street') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.PhoneCode)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$phonecode') });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.Phone)) {
                        M.toast({ html: vars._statres('msg$error$notspecified$phone') });
                        result = false;
                    }
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