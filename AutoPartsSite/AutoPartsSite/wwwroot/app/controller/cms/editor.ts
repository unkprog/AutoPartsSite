import vars = require('app/core/variables');
import base = require('app/core/basecontroller');

export namespace Controller.Cms {
    export class Editor extends base.Controller.Base {
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
            require(["summernote"], function (_summernote) {
                $('#editor-view-summernote').summernote();
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