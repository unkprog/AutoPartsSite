var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/baseservice", "../core/variables"], function (require, exports, base, variables_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        var SearchService = /** @class */ (function (_super) {
            __extends(SearchService, _super);
            function SearchService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(SearchService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/search' };
                },
                enumerable: false,
                configurable: true
            });
            SearchService.prototype.PartNumber = function (partNumber, page, Callback) {
                var pq = {
                    partNumber: partNumber,
                    Auth: variables_1._appData.Identity.Auth,
                    siteUserId: variables_1._appData.Identity.SiteUserId,
                    countryId: variables_1._appData.Settings.Country.Id,
                    languageId: variables_1._appData.Settings.Language.Id,
                    currencyId: variables_1._appData.Settings.Currency.Id,
                    pageRows: 50, page: page
                };
                this.PostApi({ Action: "/partNumber", RequestData: JSON.stringify(pq), Callback: Callback });
            };
            SearchService.prototype.ListBrands = function (Callback) {
                this.GetApi({ Action: "/listBrands", Callback: Callback });
            };
            return SearchService;
        }(base.Services.BaseService));
        Services.SearchService = SearchService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=searchservice.js.map