import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import srh = require('app/services/searchservice');
import bsk = require('app/services/basketservice');
import utils = require('app/core/utils');

export namespace Controller.Search {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
            this.searchService = new srh.Services.SearchService();
            this.basketService = new bsk.Services.BasketService();
        }

        private searchService: srh.Services.SearchService;
        public get SearchService(): srh.Services.SearchService {
            return this.searchService;
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/search/index.html", Id: "search-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
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
                "labelOnlineCatalog": vars._statres("label$catalog")
            });
        }
        
        private searchForm: JQuery;
        private proxySearch;
        private proxyPage;
        private proxyPagePrev;
        private proxyPageNext;
        private proxyAddToCard;
        private proxyReqToCard;
        private proxyWhatCar;

        private qtyForm: JQuery;
        private proxyQtyForm;

        private findArticle: string;
        public ViewInit(view: JQuery): boolean {
            let result: boolean = this.setupSearchArticle();
            super.ViewInit(view);
            return result;
        }


        protected OnViewInit(): void {
            this.searchForm = this.View.find("#search-view-form");
            vars._appData.BasketIsInit = true;
            this.BasketService.Count(this.setBasketCount);
            this.loadBrands();

            if (utils.isNullOrEmpty(this.findArticle) === false) {
                this.View.find('#search-view-part-number').val(this.findArticle);
                this.search(undefined);
            }
        }

        private setupSearchArticle(): boolean {

            var hr = window.location.href.toLocaleLowerCase();

            var i = hr.indexOf('?');
            hr = (i > -1 ? hr.substring(i + 1) : '');

            let searchParams = new URLSearchParams(hr);
            if (searchParams.has("article") === true) {
                this.findArticle = searchParams.get("article");
                return false;
            }
            return true;
        }

        private loadBrands(): void {
            let self = this;
            self.SearchService.ListBrands((responseData) => {
                if (responseData.Result === 0) {

                    let templateContent = this.View.find('#search-view-brand-catalogs-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: [] = responseData.Data;
                    
                    for (let i = 0, icount = items.length; i < icount; i++) {
                        htmlResult = (htmlResult + template(items[i]));
                    }

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
            this.proxyPage = $.proxy(this.searchPage, this);
            this.proxyPagePrev = $.proxy(this.searchPagePrev, this);
            this.proxyPageNext = $.proxy(this.searchPageNext, this);
            this.proxyAddToCard = $.proxy(this.addToCard, this);
            this.proxyReqToCard = $.proxy(this.reqToCard, this)
            this.proxyWhatCar = $.proxy(this.whatCar, this);
            $('search-view')
            this.SearchButtonClick = this.createClickEvent("search-view-btn", this.searchButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("search-view-btn", this.SearchButtonClick);
            if (this.searchForm) this.searchForm.off('submit', this.proxySearch);
        }

        private createEventItems() {
            let self = this;

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
        }

        private destroyEventItems() {
            let self = this;

            if (self.qtyForm) self.qtyForm.off('submit', self.proxyQtyForm);

            self.View.find('.card-search-whatcar').off('click', self.proxyWhatCar);

            $('#search-view-parts').find('.add-to-basket-id').off('click', self.proxyAddToCard);
            $('#search-view-parts').find('.req-to-basket-id').off('click', self.proxyReqToCard);

            $('.search-view-pagination').find('.search-view-pagination-page').off('click', self.proxyPage);
            $('.search-view-pagination').find('.search-view-pagination-prev ').off('click', self.proxyPagePrev);
            $('.search-view-pagination').find('.search-view-pagination-next ').off('click', self.proxyPageNext);
        }

        private currentPage: number;
        private maxPage: number;
        private lastSearch: string;

        private htmlItems(items: any[], header: string, template: Function): string {
            let htmlResult: string = '';
            
            for (let i = 0, icount = items.length; i < icount; i++) {
                if (i == 0) {
                    htmlResult = htmlResult + '<div class="row">';
                    htmlResult = htmlResult + '<div class="col s12 m12 l12 xl12"><div class="section left"><h1 class="page-header">' + header + '</h1></div></div>';
                    htmlResult = htmlResult + '<div class="col s12 m12 l12 xl12"><div class="divider"></div></div></div>';
                }
                items[i].labelAddToCard = items[i].StockQty > 0 ? vars._statres("button$label$add") : vars._statres("label$not$availability");
                htmlResult = (htmlResult + template(items[i]));
            }
            return htmlResult
        }

        public SearchButtonClick: { (e: any): void; };
        private searchButtonClick(e) {
            this.search(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private search(e: any): boolean {
            let self = this;
            let partNum: string = '' + self.View.find('#search-view-part-number').val();
            vars._app.ResetScroll();
            vars._app.ShowLoading(true);

            self.destroyEventItems();

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

                    self.maxPage = responseData.Data.MaxPage;
                    self.currentPage = responseData.Data.Page;

                    let htmlResult = this.htmlItems(responseData.Data.Result, vars._statres("label$parts$original"), template);
                    htmlResult = htmlResult + this.htmlItems(responseData.Data.ResultSub, vars._statres("label$parts$substitution"), template);
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
                    for (let i = 0, icount = self.maxPage; i < icount; i++) {
                        htmlResult += ' <li class="' + (self.currentPage === (i + 1) ? 'active' : 'waves-effect') + '"><a class="search-view-pagination-page" href="#!">' + (i + 1) + '</a></li>';
                    }

                    if (htmlResult !== '') {
                        htmlResult = ' <li class="' + (self.currentPage == 1 || self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-prev" href="#!"><i class="material-icons">chevron_left</i></a></li>'
                            + htmlResult
                            + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>'
                            ;
                        $('.search-view-pagination').html(htmlResult).show();
                    }

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
        }

        private searchPage(e: any): boolean {
            let self = this;
            self.currentPage = parseInt($(e.currentTarget).html());
            return self.search(e);
        }

        private searchPagePrev(e: any): boolean {
            let self = this;
            if (self.currentPage > 1)
                self.currentPage = self.currentPage - 1;
            return self.search(e);
        }

        private searchPageNext(e: any): boolean {
            let self = this;
            if (self.currentPage < self.maxPage)
                self.currentPage = self.currentPage + 1;
            return self.search(e);
        }

        private setBasketCount(responseData): void {
            if (responseData.Result === 0) {
                let count: number = responseData.Data;
                if (count > 0)
                    $('.app-basket-counter').html('' + count).show();
                else
                    $('.app-basket-counter').html('0').hide();
                if (vars._appData.BasketIsInit === false)
                    M.toast({ html: vars._statres('message$added$tocart') });
            }
            else vars._app.ShowError(responseData.Error);
            vars._appData.BasketIsInit = false;
            vars._app.HideLoading();
        }

        
        private whatCar(e: any): boolean {
            vars._app.ShowMessage("What car", "List of cars");
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private addToCard(e: any): boolean {
            vars._app.ShowLoading(false);
            let self = this;
            let id: number = $(e.currentTarget).data('id');
            let qty: number = parseInt($('#basket-qty-' + id).val() as string);
            if (qty > 0)
                self.BasketService.Add(id, qty, self.setBasketCount);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private reqToCard(e: any): boolean {
          //  vars._app.ShowLoading(false);
          
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private addQty(e: any): boolean {
            vars._app.ShowLoading(false);
            let self = this;
            let id: number = $(e.currentTarget).data('id');
            let qty: number = parseInt($('#basket-qty-' + id).val() as string);
            self.BasketService.Add(id, qty, self.setBasketCount);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

vars.registerController("search/index", function (module: any): Interfaces.IController { return new module.Controller.Search.Index(); });