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
define(["require", "exports", "app/core/variables", "app/core/utils", "app/controller/cms/editor/editor"], function (require, exports, vars, utils, editor) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms) {
            var Editor;
            (function (Editor) {
                var New = /** @class */ (function (_super) {
                    __extends(New, _super);
                    function New() {
                        return _super.call(this) || this;
                    }
                    New.prototype.createOptions = function () {
                        return { Url: "/app/controller/cms/editor/new.html", Id: "new-view" };
                    };
                    New.prototype.createModel = function () {
                        var model = _super.prototype.createModel.call(this);
                        return new kendo.data.ObservableObject({
                            "Header": "",
                            "editModel": {},
                            "labelReleaseDate": vars._statres("label$releasedate"),
                            "labelHeaderEn": vars._statres("label$header") + " En",
                            "labelHeaderRu": vars._statres("label$header") + " Ru",
                        });
                    };
                    Object.defineProperty(New.prototype, "EditIdName", {
                        get: function () {
                            return "id_new";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(New.prototype, "LoadProxy", {
                        get: function () {
                            return $.proxy(this.CmsService.EditNew, this.CmsService);
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(New.prototype, "SaveProxy", {
                        get: function () {
                            return $.proxy(this.CmsService.EditNewPost, this.CmsService);
                        },
                        enumerable: false,
                        configurable: true
                    });
                    New.prototype.ViewInit = function (view) {
                        var self = this;
                        this.dateControl = view.find("#new-view-date");
                        this.dateControl.datepicker({
                            format: "dd.mm.yyyy",
                            onSelect: function (newDate) {
                                self.Model.set("editModel.ReleaseDate", utils.date_ddmmyyyy(newDate));
                            }
                        });
                        return _super.prototype.ViewInit.call(this, view);
                    };
                    New.prototype.ViewShow = function (e) {
                        var result = _super.prototype.ViewShow.call(this, e);
                        $('#new-view-tabs').tabs();
                        M.Tabs.getInstance($('#new-view-tabs')[0]).updateTabIndicator();
                        return result;
                    };
                    New.prototype.validate = function () {
                        var model = this.Model;
                        this.Model.set("editModel.ContentEn", $('#new-view-summernote-en').summernote('code'));
                        this.Model.set("editModel.ContentRu", $('#new-view-summernote-ru').summernote('code'));
                        return true;
                    };
                    //protected createEvents(): void {
                    //}
                    //protected destroyEvents(): void {
                    //}
                    New.prototype.afterLoad = function (responseData) {
                        _super.prototype.afterLoad.call(this, responseData);
                        var self = this;
                        var model = this.EditorModel;
                        //let dateTime: Date = new Date(responseData.Data.ReleaseDate);
                        require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                            $('#new-view-tabs').tabs();
                            M.Tabs.getInstance($('#new-view-tabs')[0]).updateTabIndicator();
                            $('#new-view-header-en, #new-view-header-en').characterCounter();
                            $('#new-view-header-en, #new-view-header-ru').characterCounter();
                            M.textareaAutoResize($('#new-view-header-en'));
                            M.textareaAutoResize($('#new-view-header-ru'));
                            $('#new-view-summernote-en').summernote();
                            $('#new-view-summernote-ru').summernote();
                            $('#new-view-summernote-en').summernote('code', model.ContentEn);
                            $('#new-view-summernote-ru').summernote('code', model.ContentRu);
                            self.dateControl.val(model.ReleaseDate);
                            M.Datepicker.getInstance(self.dateControl[0]).setDate(utils.date_from_ddmmyyyy(model.ReleaseDate), true);
                            M.updateTextFields();
                        });
                    };
                    return New;
                }(editor.Controller.Cms.Editor.Editor));
                Editor.New = New;
            })(Editor = Cms.Editor || (Cms.Editor = {}));
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("cms/editor/new", function (module) { return new module.Controller.Cms.Editor.New(); });
});
//# sourceMappingURL=new.js.map