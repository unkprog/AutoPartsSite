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

        public CardNews(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/cardnews", Callback: Callback });
        }

        public EditNew(id: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/editnew", RequestData: { id: id }, Callback: Callback });
        }

        public EditNewPost(model: Interfaces.Model.INewEdit, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/editnew", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public DelNew(id: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/delnew", RequestData: { id: id }, Callback: Callback });
        }
    }
}