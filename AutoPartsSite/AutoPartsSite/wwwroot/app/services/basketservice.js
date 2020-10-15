define(["require", "exports", "app/core/baseservice"], function (require, exports, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        class BasketService extends base.Services.BaseService {
            constructor() {
                super();
            }
            get Options() {
                return { BaseUrl: '/api/basket' };
            }
            View(uid, Callback) {
                this.GetApi({ Action: "/view", RequestData: { uid: uid }, Callback: Callback });
            }
        }
        Services.BasketService = BasketService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=basketservice.js.map