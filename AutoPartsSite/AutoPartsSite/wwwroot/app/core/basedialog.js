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
define(["require", "exports", "app/core/basecontroller"], function (require, exports, bc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Dialog;
        (function (Dialog) {
            var Base = /** @class */ (function (_super) {
                __extends(Base, _super);
                function Base() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Base.prototype.Show = function (header, e) {
                };
                return Base;
            }(bc.Controller.Base));
            Dialog.Base = Base;
        })(Dialog = Controller.Dialog || (Controller.Dialog = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=basedialog.js.map