import base = require("app/core/baseservice");

export namespace Services {
    export class CmsService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/cms' };
        }
    }
}