define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            class Shipping extends base.Controller.Base {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/about/shipping.html", Id: "shipping-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$shipping")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            About.Shipping = Shipping;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/shipping", function (module) { return new module.Controller.About.Shipping(); });
});
//# sourceMappingURL=shipping.js.map