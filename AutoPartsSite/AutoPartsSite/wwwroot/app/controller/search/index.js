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
define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
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
                    return _super.call(this) || this;
                }
                Index.prototype.createOptions = function () {
                    return { Url: "/app/controller/search/index.html", Id: "search-view" };
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("button$label$find"),
                        "labelAbout": vars._statres("label$aboutUs")
                    });
                };
                Index.prototype.createEvents = function () {
                    var templateContent = this.View.find('#search-view-brand-catalogs-template').html();
                    var items = [
                        { BrandName: "BMW", BrandImage: "bmw.png" },
                        { BrandName: "Chevrolet", BrandImage: "chevrolet.png" },
                        { BrandName: "Honda", BrandImage: "honda.png" },
                        { BrandName: "Hyundai", BrandImage: "hyundai.png" },
                        { BrandName: "Infiniti", BrandImage: "infiniti.png" },
                        { BrandName: "Isuzu", BrandImage: "isuzu.png" },
                        { BrandName: "Kia", BrandImage: "kia.png" },
                        { BrandName: "Land-Rover", BrandImage: "land-rover.png" },
                    ];
                    var template = vars.getTemplate(templateContent);
                    var htmlResult = '';
                    for (var i = 0, icount = items.length; i < icount; i++)
                        htmlResult = (htmlResult + template(items[i]));
                    this.View.find('#search-view-brand-catalogs').html(htmlResult);
                };
                Index.prototype.destroyEvents = function () {
                };
                return Index;
            }(base.Controller.Base));
            Search.Index = Index;
        })(Search = Controller.Search || (Controller.Search = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("search/index", function (module) { return new module.Controller.Search.Index(); });
});
//# sourceMappingURL=index.js.map