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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/basketservice"], function (require, exports, vars, base, bsk) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Basket;
        (function (Basket) {
            var Index = /** @class */ (function (_super) {
                __extends(Index, _super);
                function Index() {
                    var _this = _super.call(this) || this;
                    _this.basketService = new bsk.Services.BasketService();
                    return _this;
                }
                Object.defineProperty(Index.prototype, "BasketService", {
                    get: function () {
                        return this.basketService;
                    },
                    enumerable: false,
                    configurable: true
                });
                Index.prototype.createOptions = function () {
                    return { Url: "/app/controller/basket/index.html", Id: "basket-view" };
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$basket"),
                        "labelBrand": vars._statres("label$brand") + ":",
                        "labelCountry": vars._statres("label$country") + ":",
                        "labelDimensions": vars._statres("label$dimensions") + ":",
                        "labelQty": vars._statres("label$qty") + ":",
                        "labelPrice": vars._statres("label$price") + ":",
                        "labelSum": vars._statres("label$sum") + ":",
                        "basketData": {}
                    });
                };
                Index.prototype.OnViewInit = function () {
                    vars._app.ShowLoading();
                    var self = this;
                    this.BasketService.View(function (responseData) {
                        self.setupBasketData(responseData);
                        vars._app.HideLoading();
                    });
                };
                Index.prototype.setupBasketData = function (responseData) {
                    var self = this;
                    if (responseData.Result === 0) {
                        this.Model.set("basketData", responseData.Data.Positions);
                        var templateContent = self.View.find('#basket-view-parts-template').html();
                        var template = vars.getTemplate(templateContent);
                        var htmlResult = '';
                        var items = responseData.Data.Positions;
                        for (var i = 0, icount = items.length; i < icount; i++) {
                            items[i].deleteLabel = vars._statres("button$label$delete");
                            items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 1);
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#basket-view-parts').html(htmlResult);
                        self.rebindModel();
                        M.updateTextFields();
                        self.qtyForm = self.View.find(".basket-qty-form");
                        if (self.qtyForm) {
                            self.proxyQtyForm = $.proxy(self.changeQty, self);
                            self.qtyForm.on('submit', self.proxyQtyForm);
                        }
                        self.deleteBtn = self.View.find(".basket-del-btn");
                        if (self.deleteBtn) {
                            self.proxyDelete = $.proxy(self.deletePart, self);
                            self.deleteBtn.on('click', self.proxyDelete);
                            self.deleteBtn.data("tooltip", vars._statres("button$label$delete"));
                            self.deleteBtn.tooltip();
                        }
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                };
                Index.prototype.deletePart = function (e) {
                    vars._app.ShowLoading();
                    var self = this;
                    var id = $(e.currentTarget).data('id');
                    self.BasketService.Delete(id, function (responseData) {
                        if (responseData.Result === 0) {
                            $("#basket-view-item-" + id).remove();
                            var count = responseData.Data;
                            if (count > 0)
                                $('.app-basket-counter').html('' + count).show();
                            else
                                $('.app-basket-counter').html('0').hide();
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                        vars._app.HideLoading();
                    });
                    e.preventDefault();
                    return false;
                };
                Index.prototype.changeQty = function (e) {
                    vars._app.ShowLoading();
                    var self = this;
                    var formid = e.currentTarget.id;
                    var id = parseInt(formid.replace('basket-qty-form-', ''));
                    var qty = parseFloat($(e.target).find('#basket-qty-' + id).val());
                    var price = parseFloat($(e.target).parent().find('#basket-price-' + id).val());
                    self.BasketService.Update(id, qty, function (responseData) {
                        if (responseData.Result === 0) {
                            //items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 1);
                            $(e.currentTarget).parent().find('#basket-sum-' + id).val(qty * (price && price > 0 ? price : 1));
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                        vars._app.HideLoading();
                    });
                    e.preventDefault();
                    return false;
                };
                Index.prototype.createEvents = function () {
                };
                Index.prototype.destroyEvents = function () {
                    if (this.deleteBtn)
                        this.deleteBtn.off('click', this.proxyDelete);
                    if (this.qtyForm)
                        this.qtyForm.off('submit', this.proxyQtyForm);
                };
                return Index;
            }(base.Controller.Base));
            Basket.Index = Index;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/index", function (module) { return new module.Controller.Basket.Index(); });
});
//# sourceMappingURL=index.js.map