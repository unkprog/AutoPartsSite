import base = require("app/core/baseservice");

export namespace Services {
    export class BasketService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/basket' };
        }

        public View(uid: string, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/view", RequestData: { uid: uid }, Callback: Callback });
        }
    }
}