import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import srh = require('app/services/searchservice');

export namespace Controller.Search {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
            this.searchService = new srh.Services.SearchService();
        }

        private searchService: srh.Services.SearchService;
        public get SearchService(): srh.Services.SearchService {
            return this.searchService;
        }


        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/search/index.html", Id: "search-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$AutoPartsSite"),
                "labelAbout": vars._statres("label$aboutUs")
            });
        }
        
        private searchForm: JQuery;
        private proxySearch;

        protected OnViewInit(): void {
            this.searchForm = this.View.find("#search-view-form");
            this.loadBrands();
        }

        private loadBrands(): void {
            let self = this;
            self.SearchService.ListBrands((responseData) => {
                if (responseData.Result === 0) {

                    let templateContent = this.View.find('#search-view-brand-catalogs-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: [] = responseData.Data;
                    for (let i = 0, icount = items.length; i < icount; i++)
                        htmlResult = (htmlResult + template(items[i]));

                    self.View.find('#search-view-brand-catalogs').html(htmlResult);
                }
                else
                    vars._app.ShowError(responseData.Error);
            });
        }
        protected createEvents(): void {
            if (this.searchForm) {
                this.proxySearch = $.proxy(this.search, this);
                this.searchForm.on('submit', this.proxySearch);
            }
        }

        protected destroyEvents(): void {
            if (this.searchForm) this.searchForm.off('submit', this.proxySearch);
        }

        private search(e: any) {
            let self = this;
            let partNum: string = '' + self.View.find('#search-view-part-number').val();

            vars._app.ShowLoading();

            self.SearchService.PartNumber(partNum, 1, (responseData) => {
                if (responseData.Result === 0) {

                    let templateContent = this.View.find('#search-view-parts-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: [] = responseData.Data;
                    for (let i = 0, icount = items.length; i < icount; i++)
                        htmlResult = (htmlResult + template(items[i]));

                    self.View.find('#search-view-parts').html(htmlResult);
                    vars._app.HideLoading();
                }
                else {
                    vars._app.ShowError(responseData.Error);
                    vars._app.HideLoading();
                }
            });
            e.preventDefault();
            return false;
        }
    }
}

vars.registerController("search/index", function (module: any): Interfaces.IController { return new module.Controller.Search.Index(); });