import base = require("app/core/baseservice");

export namespace Services {
    export class CmsService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/cms' };
        }

        
        public PageEdit(page: string, Callback: (responseData: any) => void): void {
            this.GetApi({ Action: "/editpage", RequestData: { page: page }, Callback: Callback });
        }

        public PageEditPost(model: Interfaces.Model.IPageEdit, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/editpage", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public Page(lang:string, page: string, Callback: (responseData: any) => void): void {
            this.GetApi({ Action: "/page", RequestData: { lang: lang, page: page }, Callback: Callback });
        }
    }
}