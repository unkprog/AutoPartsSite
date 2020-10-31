import vars = require('app/core/variables');
import utils = require('app/core/utils');
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
                "labelReleaseDate": vars._statres("label$releasedate"),
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

        protected dateControl: JQuery;

        public ViewInit(view: JQuery): boolean {
            let self = this;
            this.dateControl = view.find("#new-view-date");
            this.dateControl.datepicker({
                format: "dd.mm.yyyy", onSelect: function (newDate: Date) {
                    self.Model.set("editModel.ReleaseDate", utils.date_ddmmyyyy(newDate));
                }});
            return super.ViewInit(view);
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
            let self = this;
            let model: Interfaces.Model.INewEdit = this.EditorModel as Interfaces.Model.INewEdit;
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
        }



        //protected afterLoad(responseData?: any): void {
        //    super.afterLoad(responseData);
        //    let dateTime: Date = new Date(responseData.record.date);
        //    this.dateControl.val(utils.date_ddmmyyyy(dateTime));
        //    M.Datepicker.getInstance(this.dateControl[0]).setDate(dateTime, true);
        //    this.Model.set("documentConduct", ((responseData.record.options & 1) === 1));
        //    this.setupPositions();
        //}
    }
}

vars.registerController("cms/editor/new", function (module: any): Interfaces.IController { return new module.Controller.Cms.Editor.New(); });