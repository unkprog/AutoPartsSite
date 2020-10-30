import vars = require('app/core/variables');
import editor = require('app/controller/cms/editor/editor');

export namespace Controller.Cms.Editor {
    export class New extends editor.Controller.Cms.Editor.Editor {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/editor/new.html", Id: "new-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            let model = super.createModel();
            return new kendo.data.ObservableObject({
                "Header": "",
                "editModel": {},
                "labelHeaderEn": vars._statres("label$header") + " En",
                "labelHeaderRu": vars._statres("label$header") + " Ru",
            });
        }

        protected get EditIdName(): string {
            return "id_new";
        }

        protected get LoadProxy(): any {
            return $.proxy(this.CmsService.EditNew, this.CmsService);
        }

        protected get SaveProxy(): any {
            return $.proxy(this.CmsService.EditNewPost, this.CmsService);
        }

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            $('#new-view-tabs').tabs();
            M.Tabs.getInstance($('#new-view-tabs')[0]).updateTabIndicator();
            return result;
        }

        protected validate(): boolean {
            let model: kendo.data.ObservableObject = this.Model;
            this.Model.set("editModel.ContentEn", $('#new-view-summernote-en').summernote('code'));
            this.Model.set("editModel.ContentRu", $('#new-view-summernote-ru').summernote('code'));
            return true;
        }

        //protected createEvents(): void {
        //}


        //protected destroyEvents(): void {
        //}

        protected afterLoad(responseData?: any): void {
            super.afterLoad(responseData);
            let model: Interfaces.Model.INewEdit = this.EditorModel as Interfaces.Model.INewEdit;
            require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                $('#new-view-tabs').tabs();
                M.Tabs.getInstance($('#new-view-tabs')[0]).updateTabIndicator();
                $('#new-view-header-en, #new-view-header-en').characterCounter();
                M.textareaAutoResize($('#new-view-header-en'));
                M.textareaAutoResize($('#new-view-header-ru'));
                $('#new-view-summernote-en').summernote();
                $('#new-view-summernote-ru').summernote();
                $('#new-view-summernote-en').summernote('code', model.ContentEn);
                $('#new-view-summernote-ru').summernote('code', model.ContentRu);
            });
             
        }
    }
}

vars.registerController("cms/editor/new", function (module: any): Interfaces.IController { return new module.Controller.Cms.Editor.New(); });