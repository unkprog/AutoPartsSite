import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import ns = require('app/services/newsservice');

export namespace Controller.News {
    export class Index extends base.Controller.Base {
        constructor() {
            super();
            this.newsService = new ns.Services.NewsService();
        }

        private newsService: ns.Services.NewsService;
        public get NewsService(): ns.Services.NewsService {
            return this.newsService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/news/index.html", Id: "news-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$news")
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            this.search(undefined);
        }

        private proxyPage;
        private proxyPagePrev;
        private proxyPageNext;
        private proxyOpenNew;

        protected createEvents(): void {
            super.createEvents();
            this.proxyPage = $.proxy(this.searchPage, this);
            this.proxyPagePrev = $.proxy(this.searchPagePrev, this);
            this.proxyPageNext = $.proxy(this.searchPageNext, this);
            this.proxyOpenNew = $.proxy(this.openNew, this);
        }

        protected destroyEvents(): void {
            super.destroyEvents();
        }

        private currentPage: number;
        private maxPage: number;
        private lastSearch: string;

        private openNew(e: any): boolean {
            let id: number = $(e.currentTarget).data('id');
            vars._appData.NewViewItemId = id;
            vars._app.OpenController({ urlController: 'news/new', backController: this });
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }

        private search(e: any): boolean {
            let self = this;
            let newSrch: string = '';

            vars._app.ShowLoading(false);

            $('.new-view-pagination').find('.new-view-pagination-page').off('click', this.proxyPage);
            $('.new-view-pagination').find('.new-view-pagination-prev').off('click', this.proxyPagePrev);
            $('.new-view-pagination').find('.new-view-pagination-next').off('click', this.proxyPageNext);
            self.View.find('#new-view-items').find('a').off('click', this.proxyOpenNew);

            if (self.lastSearch !== newSrch) {
                self.lastSearch = newSrch;
                self.currentPage = 1;
            }

            self.maxPage = 0;
            $('.new-view-pagination').hide().html('');

            self.NewsService.News(this.currentPage, (responseData) => {
                if (responseData.Result === 0) {

                    let templateContent = this.View.find('#new-view-item-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: any[] = responseData.Data;
                    for (let i = 0, icount = items.length; i < icount; i++) {
                        items[i].labelReleaseDate = vars._statres("label$releasedate") + ": ";
                        if (i == 0)
                            self.maxPage = items[i].MaxPage;
                        htmlResult = (htmlResult + template(items[i]));
                    }

                    self.View.find('#new-view-items').html(htmlResult);
                    htmlResult = '';
                    for (let i = 0, icount = self.maxPage; i < icount; i++) {
                        
                        htmlResult += ' <li class="' + (self.currentPage === (i + 1) ? 'active' : 'waves-effect') + '"><a class="new-view-pagination-page" href="#!">' + (i + 1) + '</a></li>';
                    }


                    if (htmlResult !== '') {
                        htmlResult = ' <li class="' + (self.currentPage == 1 || self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="new-view-pagination-prev" href="#!"><i class="material-icons">chevron_left</i></a></li>'
                            + htmlResult
                            + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="new-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>'
                            ;
                        $('.new-view-pagination').html(htmlResult).show();
                        self.rebindModel();
                    }
                    $('.new-view-pagination').find('.new-view-pagination-page').on('click', this.proxyPage);
                    $('.new-view-pagination').find('.new-view-pagination-prev ').on('click', this.proxyPagePrev);
                    $('.new-view-pagination').find('.new-view-pagination-next ').on('click', this.proxyPageNext);
                    self.View.find('#new-view-items').find('a').on('click', this.proxyOpenNew);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                    vars._app.HideLoading();
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
    }
}

vars.registerController("news/index", function (module: any): Interfaces.IController { return new module.Controller.News.Index(); });