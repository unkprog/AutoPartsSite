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
            return CmsService;
        }(base.Services.BaseService));
        Services.CmsService = CmsService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=cmsservice.js.map