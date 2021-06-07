import base = require("app/core/baseservice");
import vars = require('app/core/variables');

export namespace Services {
    export class NewsService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/news' };
        }

        public News(page: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/news", RequestData: { lang: vars._appData.Locale.Id, pageRows: 25, page: page }, Callback: Callback });
        }

        public New(id: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/new", RequestData: { lang: vars._appData.Locale.Id, id: id },Callback: Callback });
        }

    }
}