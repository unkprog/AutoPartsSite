import base = require("app/core/baseservice");
import vars = require('app/core/variables');

export namespace Services {
    export class BasketService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/basket' };
        }

        public Count(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/count", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
        }

        public Add(id: number, qty: number, Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id,
                id: id, qty: qty
            };
            this.PostApi({ Action: "/add", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public Update(id: number, qty: number, Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id,
                id: id, qty: qty
            };
            this.PostApi({ Action: "/update", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public Delete(id: number, Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id,
                id: id, qty: 0
            };
            this.PostApi({ Action: "/delete", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public View(Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id
            };
            this.PostApi({ Action: "/view", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public SetPromocode(promoCode:string, Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id,
                promoCode: promoCode
            };
            this.PostApi({ Action: "/setpromocode", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public SetDeliveryTariffID(deliveryTariffID: number, Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id,
                deliveryTariffID: deliveryTariffID
            };
            this.PostApi({ Action: "/setdeliverytariff", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public DeliveryAddressData(Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id
            };
            this.PostApi({ Action: "/deliveryaddressdata", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public SetDeliveryAddressData(delivery: Interfaces.Model.IDeliveryAddressInfo, Callback: (responseData: any) => void) {
            let model = {
                DeliveryAddress: delivery,
                qs :{
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id
                }
            };
            this.PostApi({ Action: "/setdeliveryaddressdata", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public BillingAddressData(Callback: (responseData: any) => void) {
            let bq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id
            };
            this.PostApi({ Action: "/billingaddressdata", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public SetBillingAddressData(delivery: Interfaces.Model.IBillingAddressInfo, Callback: (responseData: any) => void) {
            let model = {
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
        }
    }
}