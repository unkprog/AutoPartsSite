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
            var Shipping = /** @class */ (function (_super) {
                __extends(Shipping, _super);
                function Shipping() {
                    return _super.call(this) || this;
                }
                Shipping.prototype.createOptions = function () {
                    return { Url: "/app/controller/about/shipping.html", Id: "shipping-view" };
                };
                Shipping.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$shipping")
                    });
                };
                Shipping.prototype.createEvents = function () {
                };
                Shipping.prototype.destroyEvents = function () {
                };
                return Shipping;
            }(base.Controller.Base));
            About.Shipping = Shipping;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/shipping", function (module) { return new module.Controller.About.Shipping(); });
});
//# sourceMappingURL=shipping.js.map