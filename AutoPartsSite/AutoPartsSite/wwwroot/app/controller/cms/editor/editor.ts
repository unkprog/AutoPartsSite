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
    }
}