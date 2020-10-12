import base = require("app/core/baseservice");

export namespace Services {
    export class SearchService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/search' };
        }

        public PartNumber(partNumber: string, page: number, Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/partNumber", RequestData: { partNumber: partNumber, pageRows: 50, page: page }, Callback: Callback });
        }

        public ListBrands(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/listBrands", Callback: Callback });
        }

    }
}