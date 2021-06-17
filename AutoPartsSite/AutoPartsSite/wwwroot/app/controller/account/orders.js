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
define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var Orders = /** @class */ (function (_super) {
                __extends(Orders, _super);
                function Orders() {
                    return _super.call(this) || this;
                }
                Orders.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/orders.html", Id: "orders-view", Page: "/account/orders" };
                    return options;
                };
                Orders.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$orders")
                    });
                };
                Orders.prototype.createEvents = function () {
                };
                Orders.prototype.destroyEvents = function () {
                };
                return Orders;
            }(acc.Controller.Account.Account));
            Account.Orders = Orders;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/orders", function (module) { return new module.Controller.Account.Orders(); });
});
//# sourceMappingURL=orders.js.map