import vars = require('app/core/variables');
import cms = require('app/controller/cms/cms');

export namespace Controller.Cms {
    export class Editor extends cms.Controller.Cms.Cms {
        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/editor.html", Id: "editor-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": ""
            });
        }

        protected OnViewInit(): void {
            this.Model.set("Header", vars._statres(localStorage.getItem('editorItem')));
        }

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            require(["lib/summernote-0.8.18-dist/summernote-lite.min"], function (_summernote_lite) {
                $('#editor-view-tabs').tabs();
                $('#editor-view-summernote-en').summernote();
                $('#editor-view-summernote-ru').summernote();
                M.Tabs.updateTabIndicator();
            });
            return result;
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            
        }
    }
}

vars.registerController("cms/editor", function (module: any): Interfaces.IController { return new module.Controller.Cms.Editor(); });