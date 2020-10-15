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
            this.GetApi({ Action: "/count", RequestData: { uid: vars._app.Uid }, Callback: Callback });
        }

        public Add(id: number, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/add", RequestData: JSON.stringify({ uid: vars._app.Uid, id: id }), Callback: Callback });
        }
    }
}