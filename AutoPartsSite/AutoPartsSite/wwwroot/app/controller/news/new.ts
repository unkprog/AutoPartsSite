import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import ns = require('app/services/newsservice');

export namespace Controller.News {
    export class New extends base.Controller.Base {
        constructor() {
            super();
            this.newsService = new ns.Services.NewsService();
        }

        private newsService: ns.Services.NewsService;
        public get NewsService(): ns.Services.NewsService {
            return this.newsService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/news/new.html", Id: "new-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "labelReleaseDate": vars._statres("label$releasedate") + ": ",
                "New": {
                    "Header" : "",
                    "ReleaseDate": "",
                    "Content": ""
                }
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            this.loadNew();
        }

        private loadNew(): void {
            let self = this;
            let id: number = vars._appData.NewViewItemId;
            vars._app.ShowLoading();
            self.NewsService.New(vars._appData.Locale, id, (responseData) => {
                if (responseData.Result === 0) {
                    self.Model.set("New", responseData.Data);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

       
    }
}

vars.registerController("news/new", function (module: any): Interfaces.IController { return new module.Controller.News.New(); });