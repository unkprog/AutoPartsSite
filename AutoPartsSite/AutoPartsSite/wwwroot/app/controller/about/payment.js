define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            class Payment extends base.Controller.Base {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/about/payment.html", Id: "payment-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$payment")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            About.Payment = Payment;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/payment", function (module) { return new module.Controller.About.Payment(); });
});
//# sourceMappingURL=payment.js.map