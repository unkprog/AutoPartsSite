define(["require", "exports", "app/core/baseservice"], function (require, exports, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        class SearchService extends base.Services.BaseService {
            constructor() {
                super();
            }
            get Options() {
                return { BaseUrl: '/api/search' };
            }
            PartNumber(partNumber, page, Callback) {
                this.GetApi({ Action: "/partNumber", RequestData: { partNumber: partNumber, pageRows: 50, page: page }, Callback: Callback });
            }
            ListBrands(Callback) {
                this.GetApi({ Action: "/listBrands", Callback: Callback });
            }
        }
        Services.SearchService = SearchService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=searchservice.js.map