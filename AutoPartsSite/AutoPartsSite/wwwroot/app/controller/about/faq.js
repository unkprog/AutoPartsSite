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
            var Faq = /** @class */ (function (_super) {
                __extends(Faq, _super);
                function Faq() {
                    return _super.call(this) || this;
                }
                Faq.prototype.createOptions = function () {
                    return { Url: "/app/controller/about/faq.html", Id: "faq-view" };
                };
                Faq.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$faq")
                    });
                };
                Faq.prototype.createEvents = function () {
                };
                Faq.prototype.destroyEvents = function () {
                };
                return Faq;
            }(base.Controller.Base));
            About.Faq = Faq;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/faq", function (module) { return new module.Controller.About.Faq(); });
});
//# sourceMappingURL=faq.js.map