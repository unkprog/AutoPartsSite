import vars = require('app/core/variables');
import cms = require('app/controller/cms/cms');

export namespace Controller.Cms {
    export class EditorPage extends cms.Controller.Cms.Cms {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/editorpage.html", Id: "editorpage-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "Page": "",
                "EditData": {}
            });
        }

        protected OnViewInit(): void {
            this.Model.set("Header", vars._statres(localStorage.getItem('editorItemHeader')));
            this.Model.set("Page", localStorage.getItem('editorItem'));
        }

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            let self = this;
            require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                $('#editorpage-view-tabs').tabs();
                $('#editorpage-view-summernote-en').summernote();
                $('#editorpage-view-summernote-ru').summernote();
                //M.Tabs.updateTabIndicator();
                self.loadData();
            });

            return result;
        }

        protected loadData(): boolean {
            let self = this;
            vars._app.ShowLoading();
            self.CmsService.PageEdit(self.Model.get("Page"), (responseData) => {
                if (responseData.Result === 0) {
                    let model: Interfaces.Model.IPageEdit = responseData.Data;
                    self.Model.set("EditData", model);
                    $('#editorpage-view-summernote-en').summernote('code', model.ContentEn);
                    $('#editorpage-view-summernote-ru').summernote('code', model.ContentRu);
                }
                else
                    vars._app.ShowError(responseData.Error);
                vars._app.HideLoading();
            });
            return true;
        }

        protected saveData(): boolean {
            let self = this;
            vars._app.ShowLoading();
            let model: Interfaces.Model.IPageEdit = self.Model.get("EditData");
            model.ContentEn = $('#editorpage-view-summernote-en').summernote('code');
            model.ContentRu = $('#editorpage-view-summernote-ru').summernote('code');
            if (this.validate()) {

                self.CmsService.PageEditPost(model, (responseData) => {
                    if (responseData.Result === 0) {
                        vars._main.ControllerBack(self);
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                    vars._app.HideLoading();
                });
            }
           
            return true;
        }

        protected validate(): boolean {
            return true;
        }

        protected createEvents(): void {
            this.SaveButtonClick = this.createClickEvent("editorpage-btn-save", this.saveButtonClick);
            this.CancelButtonClick = this.createClickEvent("editorpage-btn-cancel", this.cancelButtonClick);
        }


        protected destroyEvents(): void {

            this.destroyClickEvent("editorpage-btn-save", this.SaveButtonClick);
            this.destroyClickEvent("editorpage-btn-cancel", this.CancelButtonClick);
        }

        public SaveButtonClick: { (e: any): void; };
        private saveButtonClick(e: any): boolean {
            this.saveData();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public CancelButtonClick: { (e: any): void; };
        private cancelButtonClick(e: any): boolean {
            vars._main.ControllerBack(this);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

vars.registerController("cms/editorpage", function (module: any): Interfaces.IController { return new module.Controller.Cms.EditorPage(); });