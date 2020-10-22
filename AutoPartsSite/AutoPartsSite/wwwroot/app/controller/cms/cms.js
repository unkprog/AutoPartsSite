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
define(["require", "exports", "app/core/basecontroller", "app/services/cmsservice"], function (require, exports, base, cmss) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms_1) {
            var Cms = /** @class */ (function (_super) {
                __extends(Cms, _super);
                function Cms() {
                    var _this = _super.call(this) || this;
                    _this.cmsService = new cmss.Services.CmsService();
                    return _this;
                }
                Object.defineProperty(Cms.prototype, "CmsService", {
                    get: function () {
                        return this.cmsService;
                    },
                    enumerable: false,
                    configurable: true
                });
                return Cms;
            }(base.Controller.Base));
            Cms_1.Cms = Cms;
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=cms.js.map