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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/newsservice"], function (require, exports, vars, base, ns) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var News;
        (function (News) {
            var Index = /** @class */ (function (_super) {
                __extends(Index, _super);
                function Index() {
                    var _this = _super.call(this) || this;
                    _this.newsService = new ns.Services.NewsService();
                    return _this;
                }
                Object.defineProperty(Index.prototype, "NewsService", {
                    get: function () {
                        return this.newsService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Index.prototype.createOptions = function () {
                    return { Url: "/app/controller/news/index.html", Id: "news-view" };
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$news")
                    });
                };
                Index.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    this.search(undefined);
                };
                Index.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                    this.proxyPage = $.proxy(this.searchPage, this);
                    this.proxyPagePrev = $.proxy(this.searchPagePrev, this);
                    this.proxyPageNext = $.proxy(this.searchPageNext, this);
                    this.proxyOpenNew = $.proxy(this.openNew, this);
                };
                Index.prototype.destroyEvents = function () {
                    _super.prototype.destroyEvents.call(this);
                };
                Index.prototype.openNew = function (e) {
                    var id = $(e.currentTarget).data('id');
                    vars._appData.NewViewItemId = id;
                    vars._app.OpenController({ urlController: 'news/new', backController: this });
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                Index.prototype.search = function (e) {
                    var _this = this;
                    var self = this;
                    var newSrch = '';
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
                    self.NewsService.News(this.currentPage, function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#new-view-item-template').html();
                            var template = vars.getTemplate(templateContent);
                            var htmlResult = '';
                            var items = responseData.Data;
                            for (var i = 0, icount = items.length; i < icount; i++) {
                                items[i].labelReleaseDate = vars._statres("label$releasedate") + ": ";
                                if (i == 0)
                                    self.maxPage = items[i].MaxPage;
                                htmlResult = (htmlResult + template(items[i]));
                            }
                            self.View.find('#new-view-items').html(htmlResult);
                            htmlResult = '';
                            for (var i = 0, icount = self.maxPage; i < icount; i++) {
                                htmlResult += ' <li class="' + (self.currentPage === (i + 1) ? 'active' : 'waves-effect') + '"><a class="new-view-pagination-page" href="#!">' + (i + 1) + '</a></li>';
                            }
                            if (htmlResult !== '') {
                                htmlResult = ' <li class="' + (self.currentPage == 1 || self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="new-view-pagination-prev" href="#!"><i class="material-icons">chevron_left</i></a></li>'
                                    + htmlResult
                                    + '<li class="' + (self.currentPage == self.maxPage ? 'disabled' : 'waves-effect') + '"><a class="new-view-pagination-next" href="#!"><i class="material-icons">chevron_right</i></a></li>';
                                $('.new-view-pagination').html(htmlResult).show();
                                self.rebindModel();
                            }
                            $('.new-view-pagination').find('.new-view-pagination-page').on('click', _this.proxyPage);
                            $('.new-view-pagination').find('.new-view-pagination-prev ').on('click', _this.proxyPagePrev);
                            $('.new-view-pagination').find('.new-view-pagination-next ').on('click', _this.proxyPageNext);
                            self.View.find('#new-view-items').find('a').on('click', _this.proxyOpenNew);
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
                return Index;
            }(base.Controller.Base));
            News.Index = Index;
        })(News = Controller.News || (Controller.News = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("news/index", function (module) { return new module.Controller.News.Index(); });
});
//# sourceMappingURL=index.js.map