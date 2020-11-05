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
            var New = /** @class */ (function (_super) {
                __extends(New, _super);
                function New() {
                    var _this = _super.call(this) || this;
                    _this.newsService = new ns.Services.NewsService();
                    return _this;
                }
                Object.defineProperty(New.prototype, "NewsService", {
                    get: function () {
                        return this.newsService;
                    },
                    enumerable: false,
                    configurable: true
                });
                New.prototype.createOptions = function () {
                    return { Url: "/app/controller/news/new.html", Id: "new-view" };
                };
                New.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "labelReleaseDate": vars._statres("label$releasedate") + ": ",
                        "New": {
                            "Header": "",
                            "ReleaseDate": "",
                            "Content": ""
                        }
                    });
                };
                New.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    this.loadNew();
                };
                New.prototype.loadNew = function () {
                    var self = this;
                    var id = parseInt(localStorage.getItem('new-view-item'), 0);
                    vars._app.ShowLoading();
                    self.NewsService.New(vars._appData.Locale, id, function (responseData) {
                        if (responseData.Result === 0) {
                            self.Model.set("New", responseData.Data);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                return New;
            }(base.Controller.Base));
            News.New = New;
        })(News = Controller.News || (Controller.News = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("news/new", function (module) { return new module.Controller.News.New(); });
});
//# sourceMappingURL=new.js.map