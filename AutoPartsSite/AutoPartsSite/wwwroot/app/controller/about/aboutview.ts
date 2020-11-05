import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import cmss = require('app/services/cmsservice')

export namespace Controller.About {
    export class AboutView extends base.Controller.Base {
        constructor() {
            super();
            this.cmsService = new cmss.Services.CmsService();
        }

        private cmsService: cmss.Services.CmsService;
        public get CmsService(): cmss.Services.CmsService {
            return this.cmsService;
        }

        protected OnViewInit(): void {
            this.Model.set("Header", vars._statres(vars._appData.PageEditItemHeader));
        }

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            this.loadData();
            return result;
        }

        protected loadData(): boolean {
            let self = this;
            vars._app.ShowLoading();

            let options: Interfaces.IControllerPageOptions = this.Options as Interfaces.IControllerPageOptions;
            self.CmsService.Page(vars._appData.Locale, options.Page, (responseData) => {
                if (responseData.Result === 0) {
                    let model: Interfaces.Model.IPage = responseData.Data;
                    self.View.find('#' + options.Id + '-content').html(model.Content);
                }
                else
                    vars._app.ShowError(responseData.Error);
                vars._app.HideLoading();
            });
            return true;
        }
    }
}

