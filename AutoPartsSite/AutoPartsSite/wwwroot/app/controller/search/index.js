var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/searchservice", "app/services/basketservice"], function (require, exports, vars, base, srh, bsk) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Search;
        (function (Search) {
            var Index = /** @class */ (function (_super) {
                __extends(Index, _super);
                function Index() {
                    var _this = _super.call(this) || this;
                    _this.searchService = new srh.Services.SearchService();
                    _this.basketService = new bsk.Services.BasketService();
                    return _this;
                }
                Object.defineProperty(Index.prototype, "SearchService", {
                    get: function () {
                        return this.searchService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(Index.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Index.prototype.createOptions = function () {
                    return { Url: "/app/controller/search/index.html", Id: "search-view" };
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$AutoPartsSite"),
                        "labelAddToCard": vars._statres("label$addToCard"),
                        "labelPartNumber": vars._statres("label$partnumber") + ":",
                        "labelBrand": vars._statres("label$brand") + ":",
                        "labelShipIn": vars._statres("label$shipin") + ":",
                        "labelDimensions": vars._statres("label$dimensions") + ":",
                        "labelWeight": vars._statres("label$weight") + ":",
                        "labelAvailability": vars._statres("label$availability") + ":"
                    });
                };
                Index.prototype.OnViewInit = function () {
                    this.searchForm = this.View.find("#search-view-form");
                    this.BasketService.Count(this.setBasketCount);
                    this.loadBrands();
                };
                Index.prototype.loadBrands = function () {
                    var _this = this;
                    var self = this;
                    self.SearchService.ListBrands(function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#search-view-brand-catalogs-template').html();
                            var template = vars.getTemplate(templateContent);
                            var htmlResult = '';
                            var items = responseData.Data;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#search-view-brand-catalogs').html(htmlResult);
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                };
                Index.prototype.createEvents = function () {
                    if (this.searchForm) {
                        this.proxySearch = $.proxy(this.search, this);
                        this.searchForm.on('submit', this.proxySearch);
                    }
                    this.proxyPage = $.proxy(this.searchPage, this);
                    this.proxyPagePrev = $.proxy(this.searchPagePrev, this);
                    this.proxyPageNext = $.proxy(this.searchPageNext, this);
                    this.proxyAddToCard = $.proxy(this.addToCard, this);
                };
                Index.prototype.destroyEvents = function () {
                    if (this.searchForm)
                        this.searchForm.off('submit', this.proxySearch);
                };
                Index.prototype.search = function (e) {
                    var _this = this;
                    var self = this;
                    var partNum = '' + self.View.find('#search-view-part-number').val();
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
                    self.SearchService.PartNumber(partNum, this.currentPage, function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#search-view-parts-template').html();
                            var template = vars.getTemplate(templateContent);
                            var htmlResult = '';
                            var items = responseData.Data.Result;
                            self.maxPage = responseData.Data.MaxPage;
                            self.currentPage = responseData.Data.Page;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                items[i].labelAddToCard = vars._statres("button$label$add");
                                //if (i == 0)
                                //    self.maxPage = items[i].MaxPage;
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#search-view-parts').html(htmlResult);
                            htmlResult = '';
                            for (var i = 0, icount = self.maxPage; i < icount; i++) {
                                htmlResult += ' <li class="' + (self.currentPage === (i + 1) ? 'active' : 'waves-effect') + '"><a class="search-view-pagination-page" href="#!">' + (i + 1) + '</a></li>';
                            }
                            if (htmlResult !== '') {
                                htmlResult = ' <li class="' + (self.currentPage == 1 || self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-prev" href="#!"><i class="material-icons">chevron_left</i></a></li>'
                                    + htmlResult
                                    + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>';
                                $('.search-view-pagination').html(htmlResult).show();
                            }
                            self.rebindModel();
                            $('.search-view-pagination').find('.search-view-pagination-page').on('click', _this.proxyPage);
                            $('.search-view-pagination').find('.search-view-pagination-prev ').on('click', _this.proxyPagePrev);
                            $('.search-view-pagination').find('.search-view-pagination-next ').on('click', _this.proxyPageNext);
                            $('#search-view-parts').find('.card-btn-add-basket').on('click', _this.proxyAddToCard);
                            vars._app.HideLoading();
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                            vars._app.HideLoading();
                        }
                    });
                    e.preventDefault();
                    return false;
                };
                Index.prototype.searchPage = function (e) {
                    var self = this;
                    self.currentPage = parseInt($(e.currentTarget).html());
                    return self.search(e);
                };
                Index.prototype.searchPagePrev = function (e) {
                    var self = this;
                    if (self.currentPage > 1)
                        self.currentPage = self.currentPage - 1;
                    return self.search(e);
                };
                Index.prototype.searchPageNext = function (e) {
                    var self = this;
                    if (self.currentPage < self.maxPage)
                        self.currentPage = self.currentPage + 1;
                    return self.search(e);
                };
                Index.prototype.setBasketCount = function (responseData) {
                    if (responseData.Result === 0) {
                        var count = responseData.Data;
                        if (count > 0)
                            $('.app-basket-counter').html('' + count).show();
                        else
                            $('.app-basket-counter').html('0').hide();
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                    vars._app.HideLoading();
                };
                Index.prototype.addToCard = function (e) {
                    vars._app.ShowLoading();
                    var self = this;
                    var id = $(e.currentTarget).data('id');
                    this.BasketService.Add(id, self.setBasketCount);
                    e.preventDefault();
                    return false;
                };
                return Index;
            }(base.Controller.Base));
            Search.Index = Index;
        })(Search = Controller.Search || (Controller.Search = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("search/index", function (module) { return new module.Controller.Search.Index(); });
});
//# sourceMappingURL=index.js.map