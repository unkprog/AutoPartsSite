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
        var NativeBridgeService = (function (_super) {
            __extends(NativeBridgeService, _super);
            function NativeBridgeService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(NativeBridgeService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/nativebridge' };
                },
                enumerable: false,
                configurable: true
            });
            NativeBridgeService.prototype.Command = function (data, Callback) {
                this.PostApi({ Action: "/command", RequestData: data, Callback: Callback });
            };
            return NativeBridgeService;
        }(base.Services.BaseService));
        Services.NativeBridgeService = NativeBridgeService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=nativebridgeservice.js.map