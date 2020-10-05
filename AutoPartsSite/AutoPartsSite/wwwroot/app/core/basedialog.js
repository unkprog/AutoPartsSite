define(["require", "exports", "app/core/basecontroller"], function (require, exports, bc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Dialog;
        (function (Dialog) {
            class Base extends bc.Controller.Base {
                Show(header, e) {
                }
            }
            Dialog.Base = Base;
        })(Dialog = Controller.Dialog || (Controller.Dialog = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=basedialog.js.map