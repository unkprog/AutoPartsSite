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
define(["require", "exports", "app/core/baseservice", "app/core/variables"], function (require, exports, base, vars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        var BasketService = /** @class */ (function (_super) {
            __extends(BasketService, _super);
            function BasketService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(BasketService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/basket' };
                },
                enumerable: false,
                configurable: true
            });
            BasketService.prototype.Count = function (Callback) {
                this.GetApi({ Action: "/count", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
            };
            BasketService.prototype.Add = function (id, qty, Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id,
                    id: id, qty: qty
                };
                this.PostApi({ Action: "/add", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.Update = function (id, qty, Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id,
                    id: id, qty: qty
                };
                this.PostApi({ Action: "/update", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.Delete = function (id, Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id,
                    id: id, qty: 0
                };
                this.PostApi({ Action: "/delete", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.View = function (Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id
                };
                this.PostApi({ Action: "/view", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.SetPromocode = function (promoCode, Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id,
                    promoCode: promoCode
                };
                this.PostApi({ Action: "/setpromocode", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.SetDeliveryTariffID = function (deliveryTariffID, Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id,
                    deliveryTariffID: deliveryTariffID
                };
                this.PostApi({ Action: "/setdeliverytariff", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.DeliveryAddressData = function (Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id
                };
                this.PostApi({ Action: "/deliveryaddressdata", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.SetDeliveryAddressData = function (delivery, Callback) {
                var model = {
                    DeliveryAddress: delivery,
                    qs: {
                        uid: vars._appData.Uid,
                        siteUserId: vars._appData.Identity.SiteUserId,
                        countryId: vars._appData.Settings.Country.Id,
                        languageId: vars._appData.Settings.Language.Id,
                        currencyId: vars._appData.Settings.Currency.Id
                    }
                };
                this.PostApi({ Action: "/setdeliveryaddressdata", RequestData: JSON.stringify(model), Callback: Callback });
            };
            BasketService.prototype.BillingAddressData = function (Callback) {
                var bq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id
                };
                this.PostApi({ Action: "/billingaddressdata", RequestData: JSON.stringify(bq), Callback: Callback });
            };
            BasketService.prototype.SetBillingAddressData = function (delivery, Callback) {
                var model = {
                    BillingAddress: delivery,
                    qs: {
                        uid: vars._appData.Uid,
                        siteUserId: vars._appData.Identity.SiteUserId,
                        countryId: vars._appData.Settings.Country.Id,
                        languageId: vars._appData.Settings.Language.Id,
                        currencyId: vars._appData.Settings.Currency.Id
                    }
                };
                this.PostApi({ Action: "/setbillingaddressdata?uid=" + vars._appData.Uid, RequestData: JSON.stringify(model), Callback: Callback });
            };
            return BasketService;
        }(base.Services.BaseService));
        Services.BasketService = BasketService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=basketservice.js.map