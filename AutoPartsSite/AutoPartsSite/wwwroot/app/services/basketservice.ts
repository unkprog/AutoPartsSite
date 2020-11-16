﻿import base = require("app/core/baseservice");
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

        public Add(id: number, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/add", RequestData: JSON.stringify({ uid: vars._appData.Uid, id: id, qty: 1 }), Callback: Callback });
        }

        public Update(id: number, qty: number, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/update", RequestData: JSON.stringify({ uid: vars._appData.Uid, id: id, qty: qty }), Callback: Callback });
        }

        public Delete(id: number, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/delete", RequestData: JSON.stringify({ uid: vars._appData.Uid, id: id, qty: 0 }), Callback: Callback });
        }

        public View(Callback: (responseData: any) => void) {
            let pq = {
                uid: vars._appData.Uid,
                siteUserId: vars._appData.Identity.SiteUserId,
                countryId: vars._appData.Settings.Country.Id,
                languageId: vars._appData.Settings.Language.Id,
                currencyId: vars._appData.Settings.Currency.Id
            };
            this.GetApi({ Action: "/view", RequestData: pq, Callback: Callback });
        }
    }
}