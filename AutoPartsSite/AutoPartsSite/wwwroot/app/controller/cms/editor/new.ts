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
            return new kendo.data.ObservableObject({
                "Header": "",
                "Page": "",
                "EditData": {}
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

        //protected OnViewInit(): void {
        //    this.Model.set("Header", vars._statres(localStorage.getItem('editorItemHeader')));
        //    this.Model.set("Page", localStorage.getItem('editorItem'));
        //}

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            let self = this;
            require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                $('#new-view-tabs').tabs();
                $('#new-view-summernote-en').summernote();
                $('#new-view-summernote-ru').summernote();
                //M.Tabs.updateTabIndicator();
                //self.loadData();
            });

            return result;
        }

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

        protected validate(): boolean {
            return true;
        }

        //protected createEvents(): void {
        //}


        //protected destroyEvents(): void {
        //}

    }
}

vars.registerController("cms/editor/new", function (module: any): Interfaces.IController { return new module.Controller.Cms.Editor.New(); });