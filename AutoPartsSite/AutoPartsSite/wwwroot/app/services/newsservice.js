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
define(["require", "exports", "app/core/baseservice", "app/core/variables"], function (require, exports, base, vars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        var NewsService = /** @class */ (function (_super) {
            __extends(NewsService, _super);
            function NewsService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(NewsService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/news' };
                },
                enumerable: false,
                configurable: true
            });
            NewsService.prototype.News = function (page, Callback) {
                this.GetApi({ Action: "/news", RequestData: { lang: vars._appData.Locale.Id, pageRows: 25, page: page }, Callback: Callback });
            };
            NewsService.prototype.New = function (id, Callback) {
                this.GetApi({ Action: "/new", RequestData: { lang: vars._appData.Locale.Id, id: id }, Callback: Callback });
            };
            return NewsService;
        }(base.Services.BaseService));
        Services.NewsService = NewsService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=newsservice.js.map