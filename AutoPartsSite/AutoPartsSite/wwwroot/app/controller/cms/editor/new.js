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
define(["require", "exports", "app/core/variables", "app/controller/cms/editor/editor"], function (require, exports, vars, editor) {
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
                        return new kendo.data.ObservableObject({
                            "Header": "",
                            "Page": "",
                            "EditData": {}
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
                    //protected OnViewInit(): void {
                    //    this.Model.set("Header", vars._statres(localStorage.getItem('editorItemHeader')));
                    //    this.Model.set("Page", localStorage.getItem('editorItem'));
                    //}
                    New.prototype.ViewShow = function (e) {
                        var result = _super.prototype.ViewShow.call(this, e);
                        var self = this;
                        require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                            $('#new-view-tabs').tabs();
                            $('#new-view-summernote-en').summernote();
                            $('#new-view-summernote-ru').summernote();
                            //M.Tabs.updateTabIndicator();
                            //self.loadData();
                        });
                        return result;
                    };
                    //protected loadData(): boolean {
                    //    let self = this;
                    //    vars._app.ShowLoading();
                    //    self.CmsService.PageEdit(self.Model.get("Page"), (responseData) => {
                    //        if (responseData.Result === 0) {
                    //            let model: Interfaces.Model.INewEdit = responseData.Data;
                    //            self.Model.set("EditData", model);
                    //            $('#new-view-summernote-en').summernote('code', model.ContentEn);
                    //            $('#new-view-summernote-ru').summernote('code', model.ContentRu);
                    //        }
                    //        else
                    //            vars._app.ShowError(responseData.Error);
                    //        vars._app.HideLoading();
                    //    });
                    //    return true;
                    //}
                    //protected saveData(): boolean {
                    //    let self = this;
                    //    vars._app.ShowLoading();
                    //    let model: Interfaces.Model.IPageEdit = self.Model.get("EditData");
                    //    model.ContentEn = $('#new-view-summernote-en').summernote('code');
                    //    model.ContentRu = $('#new-view-summernote-ru').summernote('code');
                    //    if (this.validate()) {
                    //        self.CmsService.PageEditPost(model, (responseData) => {
                    //            if (responseData.Result === 0) {
                    //                vars._main.ControllerBack(self);
                    //            }
                    //            else
                    //                vars._app.ShowError(responseData.Error);
                    //            vars._app.HideLoading();
                    //        });
                    //    }
                    //    return true;
                    //}
                    New.prototype.validate = function () {
                        return true;
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