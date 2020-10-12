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
        private proxyPage;
        private proxyPagePrev;
        private proxyPageNext;

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
        }

        protected destroyEvents(): void {
            if (this.searchForm) this.searchForm.off('submit', this.proxySearch);

        }

        private currentPage: number;
        private maxPage: number;
        private lastSearch: string;

        private search(e: any): boolean {
            let self = this;
            let partNum: string = '' + self.View.find('#search-view-part-number').val();

            vars._app.ShowLoading();

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
                    let items: any[] = responseData.Data;
                    for (let i = 0, icount = items.length; i < icount; i++) {
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
                            + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="search-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>'
                            ;
                        $('.search-view-pagination').html(htmlResult).show();
                    }
                    $('.search-view-pagination').find('.search-view-pagination-page').on('click', this.proxyPage);
                    $('.search-view-pagination').find('.search-view-pagination-prev ').on('click', this.proxyPagePrev);
                    $('.search-view-pagination').find('.search-view-pagination-next ').on('click', this.proxyPageNext);
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

        private searchPage(e: any): boolean {
            let self = this;
            self.currentPage = Number.parseInt($(e.target).html());
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
    }
}

vars.registerController("search/index", function (module: any): Interfaces.IController { return new module.Controller.Search.Index(); });