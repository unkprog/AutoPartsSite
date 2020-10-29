import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import utils = require('app/core/utils');
import cmss = require('app/services/cmsservice')

export namespace Controller.Cms.Editor {
    export class Editor extends base.Controller.BaseEditor {
        constructor() {
            super();
        }

        private cmsService: cmss.Services.CmsService;
        public get CmsService(): cmss.Services.CmsService {
            if (!this.cmsService)
                this.cmsService = new cmss.Services.CmsService();
            return this.cmsService;
        }
        

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/editor/editor.html", Id: "editor-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            let oo: kendo.data.ObservableObject = new kendo.data.ObservableObject({
                "Header": this.Header,
                "labelDocument": "",
                "editModel": {},
            });
            return oo;
        }

        public get EditorModel(): Interfaces.Model.IEditorModel {
            let model: Interfaces.Model.IEditorModel = this.Model.get("editModel").toJSON();
            return model;
        }

        protected createEditorSettings(): Interfaces.Control.IEditorSettings {
            return { EditIdName: this.EditIdName, Load: this.LoadProxy, Save: this.SaveProxy };
        }


        protected validate(): boolean {
            return true;
        }

        protected get DocFormatDate(): string {
            return "dd.mm.yyyy";
        }

        
        public ViewInit(view: JQuery): boolean {
            return super.ViewInit(view);
        }

        public ViewShow(e: any): boolean {
            return super.ViewShow(e);
        }

        protected createEvents(): void {
            super.createEvents();
        }

        protected destroyEvents(): void {
            super.destroyEvents();
        }

        public ViewResize(e: any): void {
            super.ViewResize(e);

        }

        protected afterLoad(responseData?: any): void {
            super.afterLoad(responseData);
            //let dateTime: Date = new Date(responseData.record.date);
            //this.dateControl.val(utils.date_ddmmyyyy(dateTime));
            //M.Datepicker.getInstance(this.dateControl[0]).setDate(dateTime, true);
            //this.Model.set("documentConduct", ((responseData.record.options & 1) === 1));
            //this.setupPositions();
        }

    }
}