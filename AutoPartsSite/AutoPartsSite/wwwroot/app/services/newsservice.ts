import base = require("app/core/baseservice");

export namespace Services {
    export class NewsService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/news' };
        }

        public News(lang: string, page: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/news", RequestData: { lang: lang, pageRows: 25, page: page }, Callback: Callback });
        }

        public New(lang: string, id: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/new", RequestData: { lang: lang, id: id },Callback: Callback });
        }

    }
}