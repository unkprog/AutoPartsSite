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
define(["require", "exports", "app/core/variables", "app/controller/cms/card/card"], function (require, exports, vars, card) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms) {
            var Card;
            (function (Card) {
                var New = (function (_super) {
                    __extends(New, _super);
                    function New() {
                        return _super.call(this) || this;
                    }
                    New.prototype.createModel = function () {
                        return new kendo.data.ObservableObject({
                            "Header": vars._statres("label$news"),
                            "cardModel": []
                        });
                    };
                    Object.defineProperty(New.prototype, "LoadProxy", {
                        get: function () {
                            return $.proxy(this.CmsService.CardNews, this.CmsService);
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(New.prototype, "DeleteProxy", {
                        get: function () {
                            return $.proxy(this.CmsService.DelNew, this.CmsService);
                        },
                        enumerable: false,
                        configurable: true
                    });
                    New.prototype.columns = function () {
                        var result = [
                            { Header: vars._statres("label$date"), Field: "ReleaseDate" },
                            { Header: vars._statres("label$header") + " En", Field: "HeaderEn" },
                            { Header: vars._statres("label$header") + " Ru", Field: "HeaderRu" },
                        ];
                        return result;
                    };
                    Object.defineProperty(New.prototype, "EditIdName", {
                        get: function () {
                            return "id_new";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(New.prototype, "FilterId", {
                        get: function () {
                            return "NewCardFilterSettings";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(New.prototype, "EditController", {
                        get: function () {
                            return "cms/editor/new";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    New.prototype.ViewInit = function (view) {
                        var result = _super.prototype.ViewInit.call(this, view);
                        return result;
                    };
                    return New;
                }(card.Controller.Cms.Card.Card));
                Card.New = New;
            })(Card = Cms.Card || (Cms.Card = {}));
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("cms/card/new", function (module) { return new module.Controller.Cms.Card.New(); });
});
//# sourceMappingURL=new.js.map