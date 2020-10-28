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
        var Document;
        (function (Document) {
            var Editor;
            (function (Editor_1) {
                var Editor = /** @class */ (function (_super) {
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
                    Editor.prototype.createModel = function () {
                        var oo = new kendo.data.ObservableObject({
                            "Header": this.Header,
                            "labelDocument": "",
                            "editModel": {},
                        });
                        return oo;
                    };
                    Object.defineProperty(Editor.prototype, "DocType", {
                        get: function () {
                            return 0;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Editor.prototype, "EditorModel", {
                        get: function () {
                            var model = this.Model.get("editModel").toJSON();
                            return model;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Editor.prototype.createEditorSettings = function () {
                        return { EditIdName: this.EditIdName, Load: this.LoadProxy, Save: this.SaveProxy };
                    };
                    Object.defineProperty(Editor.prototype, "LoadProxy", {
                        get: function () {
                            return undefined; //$.proxy(this.Service.GetDocument, this.Service)
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Editor.prototype, "SaveProxy", {
                        get: function () {
                            return undefined; //$.proxy(this.Service.SetDocument, this.Service)
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Editor.prototype, "EditIdName", {
                        get: function () {
                            return "";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Editor.prototype.validate = function () {
                        return true;
                    };
                    Object.defineProperty(Editor.prototype, "DocFormatDate", {
                        get: function () {
                            return "dd.mm.yyyy";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Editor.prototype.ViewInit = function (view) {
                        return _super.prototype.ViewInit.call(this, view);
                    };
                    Editor.prototype.ViewShow = function (e) {
                        return _super.prototype.ViewShow.call(this, e);
                    };
                    Editor.prototype.createEvents = function () {
                        _super.prototype.createEvents.call(this);
                    };
                    Editor.prototype.destroyEvents = function () {
                        _super.prototype.destroyEvents.call(this);
                    };
                    Editor.prototype.ViewResize = function (e) {
                        _super.prototype.ViewResize.call(this, e);
                    };
                    Editor.prototype.afterLoad = function (responseData) {
                        _super.prototype.afterLoad.call(this, responseData);
                        //let dateTime: Date = new Date(responseData.record.date);
                        //this.dateControl.val(utils.date_ddmmyyyy(dateTime));
                        //M.Datepicker.getInstance(this.dateControl[0]).setDate(dateTime, true);
                        //this.Model.set("documentConduct", ((responseData.record.options & 1) === 1));
                        //this.setupPositions();
                    };
                    return Editor;
                }(base.Controller.BaseEditor));
                Editor_1.Editor = Editor;
            })(Editor = Document.Editor || (Document.Editor = {}));
        })(Document = Controller.Document || (Controller.Document = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=editor.js.map