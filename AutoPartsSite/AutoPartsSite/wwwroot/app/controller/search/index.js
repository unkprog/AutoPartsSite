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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/searchservice", "app/services/basketservice", "app/core/utils"], function (require, exports, vars, base, srh, bsk, utils) {
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
                        "labelAvailability": vars._statres("label$availability") + ":",
                        "labelPrice": vars._statres("label$price") + ":",
                        "labelDelivery": vars._statres("label$deliveryfrom") + ":",
                        "labelPcs": vars._statres("label$pcs"),
                        "labelSearch": vars._statres("label$search"),
                        "labelRequest": vars._statres("label$request"),
                        "labelOnlineCatalog": vars._statres("label$catalog"),
                        "labelNotAvailability": vars._statres("label$not$availability")
                    });
                };
                Index.prototype.ViewInit = function (view) {
                    var result = this.setupSearchArticle();
                    _super.prototype.ViewInit.call(this, view);
                    return result;
                };
                Index.prototype.OnViewInit = function () {
                    this.searchForm = this.View.find("#search-view-form");
                    vars._appData.BasketIsInit = true;
                    this.BasketService.Count(this.setBasketCount);
                    if (utils.isNullOrEmpty(this.findArticle) === false) {
                        this.View.find('#search-view-part-number').val(this.findArticle);
                        this.search(undefined);
                    }
                    else
                        this.loadBrands();
                };
                Index.prototype.ViewShow = function (e) {
                    var result = _super.prototype.ViewShow.call(this, e);
                    this.View.find('#search-view-part-number').focus();
                    return result;
                };
                Index.prototype.setupSearchArticle = function () {
                    var hr = window.location.href.toLocaleLowerCase();
                    var i = hr.indexOf('?');
                    hr = (i > -1 ? hr.substring(i + 1) : '');
                    var searchParams = new URLSearchParams(hr);
                    if (searchParams.has("partnumber") === true) {
                        this.findArticle = searchParams.get("partnumber");
                        return false;
                    }
                    return true;
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
                            var item = void 0;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                item = items[i];
                                item['CodeLower'] = item.Code.toLowerCase();
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
                    this.proxyReqToCard = $.proxy(this.reqToCard, this);
                    this.proxyWhatCar = $.proxy(this.whatCar, this);
                    $('search-view');
                    this.SearchButtonClick = this.createClickEvent("search-view-btn", this.searchButtonClick);
                    this.ClearButtonClick = this.createClickEvent("card-view-search-clear", this.clearButtonClick);
                };
                Index.prototype.destroyEvents = function () {
                    this.destroyClickEvent("search-view-btn", this.SearchButtonClick);
                    if (this.searchForm)
                        this.searchForm.off('submit', this.proxySearch);
                };
                Index.prototype.createEventItems = function () {
                    var self = this;
                    $('.search-view-pagination').find('.search-view-pagination-page').on('click', self.proxyPage);
                    $('.search-view-pagination').find('.search-view-pagination-prev ').on('click', self.proxyPagePrev);
                    $('.search-view-pagination').find('.search-view-pagination-next ').on('click', self.proxyPageNext);
                    $('#search-view-parts').find('.add-to-basket-id').on('click', self.proxyAddToCard);
                    $('#search-view-parts').find('.req-to-basket-id').on('click', self.proxyReqToCard);
                    self.View.find('.card-search-whatcar').on('click', self.proxyWhatCar);
                    self.qtyForm = self.View.find(".basket-qty-form");
                    if (self.qtyForm) {
                        self.proxyQtyForm = $.proxy(self.addQty, self);
                        self.qtyForm.on('submit', self.proxyQtyForm);
                    }
                };
                Index.prototype.destroyEventItems = function () {
                    var self = this;
                    if (self.qtyForm)
                        self.qtyForm.off('submit', self.proxyQtyForm);
                    self.View.find('.card-search-whatcar').off('click', self.proxyWhatCar);
                    $('#search-view-parts').find('.add-to-basket-id').off('click', self.proxyAddToCard);
                    $('#search-view-parts').find('.req-to-basket-id').off('click', self.proxyReqToCard);
                    $('.search-view-pagination').find('.search-view-pagination-page').off('click', self.proxyPage);
                    $('.search-view-pagination').find('.search-view-pagination-prev ').off('click', self.proxyPagePrev);
                    $('.search-view-pagination').find('.search-view-pagination-next ').off('click', self.proxyPageNext);
                };
                Index.prototype.htmlItems = function (items, header, template) {
                    var htmlResult = '';
                    for (var i = 0, icount = items.length; i < icount; i++) {
                        if (i == 0) {
                            htmlResult = htmlResult + '<div class="row">';
                            htmlResult = htmlResult + '<div class="col s12 m12 l12 xl12"><div class="section left"><h1 class="page-header">' + header + '</h1></div></div>';
                            htmlResult = htmlResult + '<div class="col s12 m12 l12 xl12"><div class="divider"></div></div></div>';
                        }
                        items[i].labelAddToCard = items[i].StockQty > 0 ? vars._statres("button$label$add") : vars._statres("label$not$availability");
                        htmlResult = (htmlResult + template(items[i]));
                    }
                    return htmlResult;
                };
                Index.prototype.searchButtonClick = function (e) {
                    this.search(e);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.clearButtonClick = function (e) {
                    //this.View.find('#search-view-part-number').val('');
                    //this.View.find('#search-view-parts').html('');
                    //this.View.find('#search-view-brand-catalogs').show();
                    window.location.replace('/index.html');
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.search = function (e) {
                    var _this = this;
                    var self = this;
                    var partNum = '' + self.View.find('#search-view-part-number').val();
                    vars._app.ResetScroll();
                    vars._app.ShowLoading(true);
                    self.destroyEventItems();
                    if (self.lastSearch !== partNum) {
                        self.lastSearch = partNum;
                        self.currentPage = 1;
                    }
                    if (partNum != '' && partNum.length && partNum.length == 17) {
                        window.location.replace('/catalog.html#/carInfo?q=' + partNum);
                        return false;
                    }
                    self.maxPage = 0;
                    $('.search-view-pagination').hide().html('');
                    self.SearchService.PartNumber(partNum, this.currentPage, function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#search-view-parts-template').html();
                            var template = vars.getTemplate(templateContent);
                            self.maxPage = responseData.Data.MaxPage;
                            self.currentPage = responseData.Data.Page;
                            var htmlResult = _this.htmlItems(responseData.Data.Result, vars._statres("label$parts$original"), template);
                            htmlResult = htmlResult + _this.htmlItems(responseData.Data.ResultSub, vars._statres("label$parts$substitution"), template);
                            if (utils.isNullOrEmpty(htmlResult)) {
                                if (!utils.isNullOrEmpty(partNum))
                                    self.View.find('#search-view-parts').html('<div class="center" style="font-size:1.5rem;font-style:italic;color:red;">' + vars._statres("message$article$notfound") + '</div>');
                                self.View.find('#search-view-brand-catalogs').show();
                            }
                            else {
                                self.View.find('#search-view-brand-catalogs').hide();
                                self.View.find('#search-view-parts').html(htmlResult);
                            }
                            htmlResult = '';
                            if (self.maxPage > 1) {
                                for (var i = 0, icount = self.maxPage; i < icount; i++) {
                                    htmlResult += ' <li class="' + (self.currentPage === (i + 1) ? 'active' : 'waves-effect') + '"><a class="search-view-pagination-page" href="#!">' + (i + 1) + '</a></li>';
                                }
                            }
                            if (htmlResult !== '') {
                                htmlResult = ' <li class="' + (self.currentPage == 1 || self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-prev" href="#!"><i class="material-icons">chevron_left</i></a></li>'
                                    + htmlResult
                                    + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>';
                                $('.search-view-pagination').html(htmlResult).show();
                            }
                            else
                                $('.search-view-pagination').hide();
                            self.rebindModel();
                            self.createEventItems();
                            vars._app.HideLoading();
                        }
                        else {
                            self.View.find('#search-view-brand-catalogs').show();
                            vars._app.ShowError(responseData.Error);
                            vars._app.HideLoading();
                        }
                    });
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
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
                        if (vars._appData.BasketIsInit === false)
                            M.toast({ html: vars._statres('message$added$tocart') });
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                    vars._appData.BasketIsInit = false;
                    vars._app.HideLoading();
                };
                Index.prototype.whatCar = function (e) {
                    vars._app.ShowMessage("What car", "List of cars");
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.addToCard = function (e) {
                    vars._app.ShowLoading(false);
                    var self = this;
                    var id = $(e.currentTarget).data('id');
                    var qty = parseInt($('#basket-qty-' + id).val());
                    if (qty > 0)
                        self.BasketService.Add(id, qty, self.setBasketCount);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.reqToCard = function (e) {
                    //  vars._app.ShowLoading(false);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.addQty = function (e) {
                    vars._app.ShowLoading(false);
                    var self = this;
                    var id = $(e.currentTarget).data('id');
                    var qty = parseInt($('#basket-qty-' + id).val());
                    self.BasketService.Add(id, qty, self.setBasketCount);
                    e.preventDefault();
                    e.stopPropagation();
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