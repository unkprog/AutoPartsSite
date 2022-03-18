import base = require("app/core/baseservice");
import vars = require('app/core/variables');

export namespace Services {
    export class NativeBridgeService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/nativebridge' };
        }

        public Command(data: any, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/command", RequestData: data, Callback: Callback });
        }

    }
}