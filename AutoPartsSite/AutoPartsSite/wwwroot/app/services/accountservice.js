define(["require", "exports", "app/core/baseservice"], function (require, exports, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        class AccountService extends base.Services.BaseService {
            constructor() {
                super();
            }
            get Options() {
                return { BaseUrl: '/api/account' };
            }
            Register(model, Callback) {
                this.PostApi({ Action: "/register", RequestData: JSON.stringify(model), Callback: Callback });
            }
            Recovery(model, Callback) {
                this.PostApi({ Action: "/recovery", RequestData: JSON.stringify(model), Callback: Callback });
            }
            Login(model, Callback) {
                this.PostApi({ Action: "/login", RequestData: JSON.stringify(model), Callback: Callback });
            }
        }
        Services.AccountService = AccountService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=accountservice.js.map