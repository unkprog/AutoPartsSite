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
            //let bq = {
            //    uid: vars._appData.Uid,
            //    siteUserId: vars._appData.Identity.SiteUserId,
            //    countryId: vars._appData.Settings.Country.Id,
            //    languageId: vars._appData.Settings.Language.Id,
            //    currencyId: vars._appData.Settings.Currency.Id,
            //    promoCode: promoCode
            //};
            //this.PostApi({ Action: "/view", RequestData: JSON.stringify(bq), Callback: Callback });
        }

        public DeliveryData(Callback: (responseData: any) => void) {
            let locale: string = vars._appData.Locale;
            this.GetApi({ Action: "/deliverydata", RequestData: { lang: locale }, Callback: Callback });
        }

        public SetDelivery(delivery: Interfaces.Model.IBasketDeilvery, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/setdeilvery?uid=" + vars._appData.Uid, RequestData: JSON.stringify({ delivery: delivery }), Callback: Callback });
        }

    }
}