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
            var Billing = (function (_super) {
                __extends(Billing, _super);
                function Billing() {
                    var _this = _super.call(this) || this;
                    _this.basketService = new bsk.Services.BasketService();
                    return _this;
                }
                Object.defineProperty(Billing.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Billing.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/basket/billing.html", Id: "billing-view", Page: "/basket/billing" };
                    return options;
                };
                Billing.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$address$billing"),
                        "labelBack": vars._statres("label$back"),
                        "labelForward": vars._statres("label$forward"),
                        "labelFullName": vars._statres("label$fullname"),
                        "labelCountry": vars._statres("label$country"),
                        "labelRegion": vars._statres("label$region"),
                        "labelCity": vars._statres("label$city"),
                        "labelZipCode": vars._statres("label$zipcode"),
                        "labelStreet": vars._statres("label$address"),
                        "labelPhoneCode": vars._statres("label$phonecode"),
                        "labelPhone": vars._statres("label$phone"),
                        "labelEmail": vars._statres("label$email"),
                        "BillingAddress": {}
                    });
                };
                Billing.prototype.ViewInit = function (view) {
                    _super.prototype.ViewInit.call(this, view);
                    return false;
                };
                Billing.prototype.OnViewInit = function () {
                    var self = this;
                    this.BasketService.BillingAddressData(function (responseData) {
                        if (responseData.Result === 0) {
                            self.setupBillingData(responseData);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                Billing.prototype.setupBillingData = function (responseData) {
                    var settings = vars._appData.Settings;
                    var countries = responseData.Data.Countries;
                    if (utils.isNullOrEmpty(responseData.Data.BillingAddress.Email))
                        responseData.Data.BillingAddress.Email = vars._appData.Identity.User.Email;
                    this.Model.set("BillingAddress", responseData.Data.BillingAddress);
                    var html = '';
                    for (var i = 0, icount = countries.length; i < icount; i++) {
                        if (settings.Country.Id == countries[i].Id)
                            this.Model.set("BillingAddress.CountryId", countries[i].Id);
                        html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Id == countries[i].Id ? 'selected' : '') + '>';
                        html = html + countries[i].Name + '</option>';
                    }
                    $('#billing-view-country').html(html);
                    this.View.find('select').formSelect();
                    M.updateTextFields();
                };
                Billing.prototype.createEvents = function () {
                    this.CheckoutButtonClick = this.createClickEvent("billing-checkout-btn", this.checkoutButtonClick);
                    this.BackButtonClick = this.createClickEvent("billing-back-btn", this.backButtonClick);
                };
                Billing.prototype.destroyEvents = function () {
                    this.destroyClickEvent("billing-back-btn", this.BackButtonClick);
                    this.destroyClickEvent("billing-checkout-btn", this.CheckoutButtonClick);
                };
                Billing.prototype.backButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "basket/delivery" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Billing.prototype.checkoutButtonClick = function (e) {
                    var self = this;
                    var billingInfo = self.Model.get("BillingAddress").toJSON();
                    if (self.validate(billingInfo)) {
                        self.BasketService.SetBillingAddressData(billingInfo, function (responseData) {
                            if (responseData.Result === 0) {
                                self.createOrder();
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
                Billing.prototype.createOrder = function () {
                    var self = this;
                    self.BasketService.CreateOrder(function (responseData) {
                        if (responseData.Result === 0) {
                            if (responseData.Data.OrderHeaderID > 0) {
                                $('.app-basket-counter').hide();
                                vars._appData.SetOrderBasket(responseData.Data.OrderHeaderID, true);
                                vars._app.OpenController({ urlController: "account/orderpayment" });
                            }
                            M.toast({ html: responseData.Data.StatusMessage });
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                };
                Billing.prototype.validate = function (model) {
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
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    return result;
                };
                return Billing;
            }(base.Controller.Base));
            Basket.Billing = Billing;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/billing", function (module) { return new module.Controller.Basket.Billing(); });
});
//# sourceMappingURL=billing.js.map