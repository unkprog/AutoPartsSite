define(["require", "exports", "app/core/baseservice", "app/core/variables"], function (require, exports, base, vars) {
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
            Count(Callback) {
                this.GetApi({ Action: "/count", RequestData: { uid: vars._app.Uid }, Callback: Callback });
            }
            Add(id, Callback) {
                this.PostApi({ Action: "/add", RequestData: JSON.stringify({ uid: vars._app.Uid, id: id }), Callback: Callback });
            }
        }
        Services.BasketService = BasketService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=basketservice.js.map