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
define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            var Payment = /** @class */ (function (_super) {
                __extends(Payment, _super);
                function Payment() {
                    return _super.call(this) || this;
                }
                Payment.prototype.createOptions = function () {
                    return { Url: "/app/controller/about/payment.html", Id: "payment-view" };
                };
                Payment.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$payment")
                    });
                };
                Payment.prototype.createEvents = function () {
                };
                Payment.prototype.destroyEvents = function () {
                };
                return Payment;
            }(base.Controller.Base));
            About.Payment = Payment;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/payment", function (module) { return new module.Controller.About.Payment(); });
});
//# sourceMappingURL=payment.js.map