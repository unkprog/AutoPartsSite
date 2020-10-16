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
define(["require", "exports", "app/core/baseservice"], function (require, exports, base) {
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
                this.GetApi({ Action: "/partNumber", RequestData: { partNumber: partNumber, pageRows: 50, page: page }, Callback: Callback });
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