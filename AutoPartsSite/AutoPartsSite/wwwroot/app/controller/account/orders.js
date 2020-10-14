define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            class Orders extends acc.Controller.Account.Account {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/account/orders.html", Id: "orders-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$orders")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            Account.Orders = Orders;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/orders", function (module) { return new module.Controller.Account.Orders(); });
});
//# sourceMappingURL=orders.js.map