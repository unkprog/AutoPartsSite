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
        var News;
        (function (News) {
            var New = /** @class */ (function (_super) {
                __extends(New, _super);
                function New() {
                    return _super.call(this) || this;
                }
                New.prototype.createOptions = function () {
                    return { Url: "/app/controller/news/new.html", Id: "new-view" };
                };
                New.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$news")
                    });
                };
                New.prototype.createEvents = function () {
                };
                New.prototype.destroyEvents = function () {
                };
                return New;
            }(base.Controller.Base));
            News.New = New;
        })(News = Controller.News || (Controller.News = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("news/new", function (module) { return new module.Controller.News.New(); });
});
//# sourceMappingURL=new.js.map