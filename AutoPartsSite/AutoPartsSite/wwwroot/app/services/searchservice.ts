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
            let pq = {
                partNumber: partNumber,
                Auth: _appData.Identity.Auth,
                siteUserId: _appData.Identity.SiteUserId,
                countryId: _appData.Settings.Country.Id,
                languageId: _appData.Settings.Language.Id,
                currencyId: _appData.Settings.Currency.Id,
                pageRows: 50, page: page
            };
            this.PostApi({ Action: "/partNumber", RequestData: JSON.stringify(pq), Callback: Callback });
        }

        public ListBrands(Callback: (responseData: any) => void) {
            this.GetApi({ Action: "/listBrands", Callback: Callback });
        }

        
        public SendAskQuestion(question: Interfaces.Model.IAskQuestion, Callback: (responseData: any) => void) {
            this.PostApi({ Action: "/askquestion", RequestData: JSON.stringify(question), Callback: Callback });
        }
    }
}