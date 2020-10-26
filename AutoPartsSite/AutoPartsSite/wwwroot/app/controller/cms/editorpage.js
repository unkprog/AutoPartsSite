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
define(["require", "exports", "app/core/variables", "app/controller/cms/cms"], function (require, exports, vars, cms) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms) {
            var EditorPage = /** @class */ (function (_super) {
                __extends(EditorPage, _super);
                function EditorPage() {
                    return _super.call(this) || this;
                }
                EditorPage.prototype.createOptions = function () {
                    return { Url: "/app/controller/cms/editorpage.html", Id: "editorpage-view" };
                };
                EditorPage.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "Page": "",
                        "EditData": {}
                    });
                };
                EditorPage.prototype.OnViewInit = function () {
                    this.Model.set("Header", vars._statres(localStorage.getItem('editorItemHeader')));
                    this.Model.set("Page", localStorage.getItem('editorItem'));
                };
                EditorPage.prototype.ViewShow = function (e) {
                    var result = _super.prototype.ViewShow.call(this, e);
                    var self = this;
                    require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                        $('#editorpage-view-tabs').tabs();
                        $('#editorpage-view-summernote-en').summernote();
                        $('#editorpage-view-summernote-ru').summernote();
                        //M.Tabs.updateTabIndicator();
                        self.loadData();
                    });
                    return result;
                };
                EditorPage.prototype.loadData = function () {
                    var self = this;
                    vars._app.ShowLoading();
                    self.CmsService.PageEdit(self.Model.get("Page"), function (responseData) {
                        if (responseData.Result === 0) {
                            var model = responseData.Data;
                            self.Model.set("EditData", model);
                            $('#editorpage-view-summernote-en').summernote('code', model.ContentEn);
                            $('#editorpage-view-summernote-ru').summernote('code', model.ContentRu);
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                        vars._app.HideLoading();
                    });
                    return true;
                };
                EditorPage.prototype.saveData = function () {
                    var self = this;
                    vars._app.ShowLoading();
                    var model = self.Model.get("EditData");
                    model.ContentEn = $('#editorpage-view-summernote-en').summernote('code');
                    model.ContentRu = $('#editorpage-view-summernote-ru').summernote('code');
                    if (this.validate()) {
                        self.CmsService.PageEditPost(model, function (responseData) {
                            if (responseData.Result === 0) {
                                vars._main.ControllerBack(self);
                            }
                            else
                                vars._app.ShowError(responseData.Error);
                            vars._app.HideLoading();
                        });
                    }
                    return true;
                };
                EditorPage.prototype.validate = function () {
                    return true;
                };
                EditorPage.prototype.createEvents = function () {
                    this.SaveButtonClick = this.createClickEvent("editorpage-btn-save", this.saveButtonClick);
                    this.CancelButtonClick = this.createClickEvent("editorpage-btn-cancel", this.cancelButtonClick);
                };
                EditorPage.prototype.destroyEvents = function () {
                    this.destroyClickEvent("editorpage-btn-save", this.SaveButtonClick);
                    this.destroyClickEvent("editorpage-btn-cancel", this.CancelButtonClick);
                };
                EditorPage.prototype.saveButtonClick = function (e) {
                    this.saveData();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                EditorPage.prototype.cancelButtonClick = function (e) {
                    vars._main.ControllerBack(this);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                return EditorPage;
            }(cms.Controller.Cms.Cms));
            Cms.EditorPage = EditorPage;
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("cms/editorpage", function (module) { return new module.Controller.Cms.EditorPage(); });
});
//# sourceMappingURL=editorpage.js.map