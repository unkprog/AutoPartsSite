define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            class Faq extends base.Controller.Base {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/about/faq.html", Id: "faq-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$faq")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            About.Faq = Faq;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/faq", function (module) { return new module.Controller.About.Faq(); });
});
//# sourceMappingURL=faq.js.map