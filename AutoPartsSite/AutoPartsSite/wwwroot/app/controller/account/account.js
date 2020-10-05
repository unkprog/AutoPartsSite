define(["require", "exports", "app/core/basecontroller", "app/services/accountservice"], function (require, exports, bc, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account_1) {
            class Account extends bc.Controller.Base {
                constructor() {
                    super();
                    this.accountService = new acc.Services.AccountService();
                }
                get AccountService() {
                    return this.accountService;
                }
            }
            Account_1.Account = Account;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=account.js.map