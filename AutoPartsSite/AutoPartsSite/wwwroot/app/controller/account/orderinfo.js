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
            var OrderInfo = (function (_super) {
                __extends(OrderInfo, _super);
                function OrderInfo() {
                    return _super.call(this) || this;
                }
                OrderInfo.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/orderinfo.html", Id: "orderinfo-view", Page: "/account/orderinfo" };
                    return options;
                };
                OrderInfo.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$order"),
                        "labelEmptyOrders": vars._statres("label$order$empty"),
                        "labelOrderNumber": vars._statres("label$order$no"),
                        "labelOrderDate": vars._statres("label$order$date"),
                        "labelCurrency": vars._statres("label$currency"),
                        "labelDelivery": vars._statres("label$shipping"),
                        "labelComment": vars._statres("label$order$comment"),
                        "labelOpenOrder": vars._statres("label$order$open"),
                    });
                };
                OrderInfo.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    var self = this;
                    self.AccountService.Orders(function (responseData) {
                        if (responseData.Result === 0) {
                            self.showOrder(responseData.Data);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                OrderInfo.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                };
                OrderInfo.prototype.destroyEvents = function () {
                    _super.prototype.destroyEvents.call(this);
                };
                OrderInfo.prototype.showOrder = function (e) {
                };
                return OrderInfo;
            }(acc.Controller.Account.Account));
            Account.OrderInfo = OrderInfo;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/orderinfo", function (module) { return new module.Controller.Account.OrderInfo(); });
});
//# sourceMappingURL=orderinfo.js.map