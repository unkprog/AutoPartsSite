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
        var Cms;
        (function (Cms) {
            var Editor = /** @class */ (function (_super) {
                __extends(Editor, _super);
                function Editor() {
                    return _super.call(this) || this;
                }
                Editor.prototype.createOptions = function () {
                    return { Url: "/app/controller/cms/editor.html", Id: "editor-view" };
                };
                Editor.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": ""
                    });
                };
                Editor.prototype.OnViewInit = function () {
                    this.Model.set("Header", vars._statres(localStorage.getItem('editorItem')));
                };
                Editor.prototype.ViewShow = function (e) {
                    var result = _super.prototype.ViewShow.call(this, e);
                    require(["summernote"], function (_summernote) {
                        $('#editor-view-summernote').summernote();
                    });
                    return result;
                };
                Editor.prototype.createEvents = function () {
                };
                Editor.prototype.destroyEvents = function () {
                };
                return Editor;
            }(base.Controller.Base));
            Cms.Editor = Editor;
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("cms/editor", function (module) { return new module.Controller.Cms.Editor(); });
});
//# sourceMappingURL=editor.js.map