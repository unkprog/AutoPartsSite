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
define(["require", "exports", "app/core/basecontroller", "app/services/cmsservice"], function (require, exports, base, cmss) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms) {
            var Editor;
            (function (Editor_1) {
                var Editor = (function (_super) {
                    __extends(Editor, _super);
                    function Editor() {
                        return _super.call(this) || this;
                    }
                    Object.defineProperty(Editor.prototype, "CmsService", {
                        get: function () {
                            if (!this.cmsService)
                                this.cmsService = new cmss.Services.CmsService();
                            return this.cmsService;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Editor.prototype.createOptions = function () {
                        return { Url: "/app/controller/cms/editor/editor.html", Id: "editor-view" };
                    };
                    return Editor;
                }(base.Controller.BaseEditor));
                Editor_1.Editor = Editor;
            })(Editor = Cms.Editor || (Cms.Editor = {}));
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=editor.js.map