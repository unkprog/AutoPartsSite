define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/searchservice", "app/services/basketservice"], function (require, exports, vars, base, srh, bsk) {
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
                    this.basketService = new bsk.Services.BasketService();
                }
                get SearchService() {
                    return this.searchService;
                }
                get BasketService() {
                    return this.basketService;
                }
                createOptions() {
                    return { Url: "/app/controller/search/index.html", Id: "search-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$AutoPartsSite"),
                        "labelAddToCard": vars._statres("label$addToCard")
                    });
                }
                OnViewInit() {
                    this.searchForm = this.View.find("#search-view-form");
                    this.BasketService.Count(this.setBasketCount);
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
                            for (let i = 0, icount = items.length; i < icount; i++) {
                                htmlResult = (htmlResult + template(items[i]));
                            }
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
                    this.proxyPage = $.proxy(this.searchPage, this);
                    this.proxyPagePrev = $.proxy(this.searchPagePrev, this);
                    this.proxyPageNext = $.proxy(this.searchPageNext, this);
                    this.proxyAddToCard = $.proxy(this.addToCard, this);
                }
                destroyEvents() {
                    if (this.searchForm)
                        this.searchForm.off('submit', this.proxySearch);
                }
                search(e) {
                    let self = this;
                    let partNum = '' + self.View.find('#search-view-part-number').val();
                    vars._app.ShowLoading();
                    $('#search-view-parts').find('.card-btn-add-basket').off('click', this.proxyAddToCard);
                    $('.search-view-pagination').find('.search-view-pagination-page').off('click', this.proxyPage);
                    $('.search-view-pagination').find('.search-view-pagination-prev ').off('click', this.proxyPagePrev);
                    $('.search-view-pagination').find('.search-view-pagination-next ').off('click', this.proxyPageNext);
                    if (self.lastSearch !== partNum) {
                        self.lastSearch = partNum;
                        self.currentPage = 1;
                    }
                    self.maxPage = 0;
                    $('.search-view-pagination').hide().html('');
                    self.SearchService.PartNumber(partNum, this.currentPage, (responseData) => {
                        if (responseData.Result === 0) {
                            let templateContent = this.View.find('#search-view-parts-template').html();
                            let template = vars.getTemplate(templateContent);
                            let htmlResult = '';
                            let items = responseData.Data;
                            for (let i = 0, icount = items.length; i < icount; i++) {
                                items[i].labelAddToCard = vars._statres("label$addToCard");
                                if (i == 0)
                                    self.maxPage = items[i].MaxPage;
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#search-view-parts').html(htmlResult);
                            htmlResult = '';
                            for (let i = 0, icount = self.maxPage; i < icount; i++) {
                                htmlResult += ' <li class="' + (self.currentPage === (i + 1) ? 'active' : 'waves-effect') + '"><a class="search-view-pagination-page" href="#!">' + (i + 1) + '</a></li>';
                            }
                            if (htmlResult !== '') {
                                htmlResult = ' <li class="' + (self.currentPage == 1 || self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-prev" href="#!"><i class="material-icons">chevron_left</i></a></li>'
                                    + htmlResult
                                    + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>';
                                $('.search-view-pagination').html(htmlResult).show();
                            }
                            $('.search-view-pagination').find('.search-view-pagination-page').on('click', this.proxyPage);
                            $('.search-view-pagination').find('.search-view-pagination-prev ').on('click', this.proxyPagePrev);
                            $('.search-view-pagination').find('.search-view-pagination-next ').on('click', this.proxyPageNext);
                            $('#search-view-parts').find('.card-btn-add-basket').on('click', this.proxyAddToCard);
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
                searchPage(e) {
                    let self = this;
                    self.currentPage = Number.parseInt($(e.target).html());
                    return self.search(e);
                }
                searchPagePrev(e) {
                    let self = this;
                    if (self.currentPage > 1)
                        self.currentPage = self.currentPage - 1;
                    return self.search(e);
                }
                searchPageNext(e) {
                    let self = this;
                    if (self.currentPage < self.maxPage)
                        self.currentPage = self.currentPage + 1;
                    return self.search(e);
                }
                setBasketCount(responseData) {
                    if (responseData.Result === 0) {
                        let count = responseData.Data;
                        if (count > 0)
                            $('.app-basket-counter').html('' + count).show();
                        else
                            $('.app-basket-counter').html('0').hide();
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                    vars._app.HideLoading();
                }
                addToCard(e) {
                    vars._app.ShowLoading();
                    let self = this;
                    let id = $(e.target).data('id');
                    this.BasketService.Add(id, self.setBasketCount);
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