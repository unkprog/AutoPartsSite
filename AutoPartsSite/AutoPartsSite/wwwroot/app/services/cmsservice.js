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
        var CmsService = (function (_super) {
            __extends(CmsService, _super);
            function CmsService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(CmsService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/cms' };
                },
                enumerable: false,
                configurable: true
            });
            CmsService.prototype.PageEdit = function (page, Callback) {
                this.GetApi({ Action: "/editpage", RequestData: { page: page }, Callback: Callback });
            };
            CmsService.prototype.PageEditPost = function (model, Callback) {
                this.PostApi({ Action: "/editpage", RequestData: JSON.stringify(model), Callback: Callback });
            };
            CmsService.prototype.Page = function (page, Callback) {
                this.GetApi({ Action: "/page", RequestData: { lang: vars._appData.Locale.Id, page: page }, Callback: Callback });
            };
            CmsService.prototype.CardNews = function (Callback) {
                this.GetApi({ Action: "/cardnews", Callback: Callback });
            };
            CmsService.prototype.EditNew = function (id, Callback) {
                this.GetApi({ Action: "/editnew", RequestData: { id: id }, Callback: Callback });
            };
            CmsService.prototype.EditNewPost = function (model, Callback) {
                this.PostApi({ Action: "/editnew", RequestData: JSON.stringify(model), Callback: Callback });
            };
            CmsService.prototype.DelNew = function (id, Callback) {
                this.GetApi({ Action: "/delnew", RequestData: { id: id }, Callback: Callback });
            };
            return CmsService;
        }(base.Services.BaseService));
        Services.CmsService = CmsService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=cmsservice.js.map