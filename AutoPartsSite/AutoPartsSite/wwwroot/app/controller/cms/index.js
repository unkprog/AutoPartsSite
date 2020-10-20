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
        var CMS;
        (function (CMS) {
            var Index = /** @class */ (function (_super) {
                __extends(Index, _super);
                function Index() {
                    return _super.call(this) || this;
                }
                Index.prototype.createOptions = function () {
                    return { Url: "/app/controller/cms/index.html", Id: "cms-view" };
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$news")
                    });
                };
                Index.prototype.createEvents = function () {
                };
                Index.prototype.destroyEvents = function () {
                };
                return Index;
            }(base.Controller.Base));
            CMS.Index = Index;
        })(CMS = Controller.CMS || (Controller.CMS = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("cms/index", function (module) { return new module.Controller.CMS.Index(); });
});
//# sourceMappingURL=index.js.map