import base = require("app/core/baseservice");
import { _appData } from "../core/variables";

export namespace Services {
    export class SearchService extends base.Services.BaseService {

        constructor() {
            super();
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '/api/search' };
        }

        public PartNumber(partNumber: string, page: number, Callback: (responseData: any) => void) {
            let languageId: number = _appData.Settings.Language.Id;
            let currencyId: number = _appData.Settings.Currency.Id;
            this.GetApi({ Action: "/partNumber", RequestData: { partNumber: partNumber, languageId: languageId, currencyId: currencyId, pageRows: 50, page: page }, Callback: Callback });
        }

        public ListBrands(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/listBrands", Callback: Callback });
        }

    }
}