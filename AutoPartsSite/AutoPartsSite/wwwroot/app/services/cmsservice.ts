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

        public GetDocuments(model: Interfaces.Model.ICardParams, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/get_docs", RequestData: JSON.stringify(model), Callback: Callback });
        }

        public GetDocument(id: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/get_doc", RequestData: { id: id }, Callback: Callback });
        }

        //public SetDocument(model: Interfaces.Model.IDocumentModel, Callback: (responseData: any) => void) {
        //    this.PostApi({ Action: "/post_doc", RequestData: JSON.stringify(model), Callback: Callback });
        //}

        public DelDocument(id: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/del_doc", RequestData: { id: id }, Callback: Callback });
        }
    }
}