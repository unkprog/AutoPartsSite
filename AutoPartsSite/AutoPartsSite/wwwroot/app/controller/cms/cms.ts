import base = require('app/core/basecontroller')
import cmss = require('app/services/cmsservice')

export namespace Controller.Cms {
    export class Cms extends base.Controller.Base {
        constructor() {
            super();
            this.cmsService = new cmss.Services.CmsService();
        }

        private cmsService: cmss.Services.CmsService;
        public get CmsService(): cmss.Services.CmsService {
            return this.cmsService;
        }
    }
}