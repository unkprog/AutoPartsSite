define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/searchservice"], function (require, exports, vars, base, srh) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Search;
        (function (Search) {
            class Index extends base.Controller.Base {
                constructor() {
                    super();
                    this.searchService = new srh.Services.SearchService();
                }
                get SearchService() {
                    return this.searchService;
                }
                createOptions() {
                    return { Url: "/app/controller/search/index.html", Id: "search-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$AutoPartsSite"),
                        "labelAbout": vars._statres("label$aboutUs")
                    });
                }
                OnViewInit() {
                    this.searchForm = this.View.find("#search-view-form");
                    this.loadBrands();
                }
                loadBrands() {
                    let self = this;
                    self.SearchService.ListBrands((responseData) => {
                        if (responseData.Result === 0) {
                            let templateContent = this.View.find('#search-view-brand-catalogs-template').html();
                            let template = vars.getTemplate(templateContent);
                            let htmlResult = '';
                            let items = responseData.Data;
                            for (let i = 0, icount = items.length; i < icount; i++)
                                htmlResult = (htmlResult + template(items[i]));
                            self.View.find('#search-view-brand-catalogs').html(htmlResult);
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                }
                createEvents() {
                    if (this.searchForm) {
                        this.proxySearch = $.proxy(this.search, this);
                        this.searchForm.on('submit', this.proxySearch);
                    }
                }
                destroyEvents() {
                    if (this.searchForm)
                        this.searchForm.off('submit', this.proxySearch);
                }
                search(e) {
                    let self = this;
                    let partNum = '' + self.View.find('#search-view-part-number').val();
                    vars._app.ShowLoading();
                    self.SearchService.PartNumber(partNum, 1, (responseData) => {
                        if (responseData.Result === 0) {
                            let templateContent = this.View.find('#search-view-parts-template').html();
                            let template = vars.getTemplate(templateContent);
                            let htmlResult = '';
                            let items = responseData.Data;
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
            Search.Index = Index;
        })(Search = Controller.Search || (Controller.Search = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("search/index", function (module) { return new module.Controller.Search.Index(); });
});
//# sourceMappingURL=index.js.map