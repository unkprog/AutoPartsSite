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
        var CmsService = /** @class */ (function (_super) {
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
            CmsService.prototype.Page = function (lang, page, Callback) {
                this.GetApi({ Action: "/page", RequestData: { lang: lang, page: page }, Callback: Callback });
            };
            CmsService.prototype.GetDocuments = function (model, Callback) {
                this.PostApi({ Action: "/get_docs", RequestData: JSON.stringify(model), Callback: Callback });
            };
            CmsService.prototype.GetDocument = function (id, Callback) {
                this.GetApi({ Action: "/get_doc", RequestData: { id: id }, Callback: Callback });
            };
            //public SetDocument(model: Interfaces.Model.IDocumentModel, Callback: (responseData: any) => void) {
            //    this.PostApi({ Action: "/post_doc", RequestData: JSON.stringify(model), Callback: Callback });
            //}
            CmsService.prototype.DelDocument = function (id, Callback) {
                this.GetApi({ Action: "/del_doc", RequestData: { id: id }, Callback: Callback });
            };
            return CmsService;
        }(base.Services.BaseService));
        Services.CmsService = CmsService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=cmsservice.js.map