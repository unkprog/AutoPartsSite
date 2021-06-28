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
define(["require", "exports", "app/core/variables", "app/controller/about/aboutview"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            var Policies = (function (_super) {
                __extends(Policies, _super);
                function Policies() {
                    return _super.call(this) || this;
                }
                Policies.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/about/policies.html", Id: "policies-view", Page: "/about/policies" };
                    return options;
                };
                return Policies;
            }(base.Controller.About.AboutView));
            About.Policies = Policies;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/policies", function (module) { return new module.Controller.About.Policies(); });
});
//# sourceMappingURL=policies.js.map