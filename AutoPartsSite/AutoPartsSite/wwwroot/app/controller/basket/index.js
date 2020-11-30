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
                    _this.deliveryId = 0;
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
                        "labelEmptyBasket": vars._statres("label$empty$basket"),
                        "labelDelivery": vars._statres("label$shipping"),
                        "labelBrand": vars._statres("label$brand") + ":",
                        "labelCountry": vars._statres("label$country") + ":",
                        "labelShipIn": vars._statres("label$shipin") + ":",
                        "labelDimensions": vars._statres("label$dimensions") + ":",
                        "labelWeight": vars._statres("label$weight") + ":",
                        "labelQty": vars._statres("label$qty") + ":",
                        "labelPrice": vars._statres("label$price") + ":",
                        "labelSum": vars._statres("label$sum") + ":",
                        "labelTotalSum": vars._statres("label$total$goods$sum") + ":",
                        "TotalSumValue": "0$",
                        "curSymbol": "$",
                        "labelTotalSumDelivery": vars._statres("label$total") + ":",
                        "TotalSum": "0$",
                        "labelSumParts": vars._statres("label$sum$parts") + ":",
                        "labelDeliveryAmount": vars._statres("label$delivery$ammount") + ":",
                        "labelVatAmount": vars._statres("label$vat") + ":",
                        "labelTotalAmount": vars._statres("label$total") + ":",
                        "labelContinueShopping": vars._statres("button$label$continueShopping"),
                        "labelCheckout": vars._statres("button$label$checkout"),
                        "basketData": {}
                    });
                };
                Index.prototype.ViewInit = function (view) {
                    _super.prototype.ViewInit.call(this, view);
                    return false;
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
                    self.destroyCardsItems();
                    self.View.find('#basket-view-additional').hide();
                    if (responseData.Result === 0) {
                        this.Model.set("basketData", responseData.Data);
                        var items = responseData.Data.Positions;
                        var icount = items.length;
                        if (icount > 0)
                            self.View.find('#basket-view-additional').show();
                        else
                            return;
                        var templateContent = self.View.find('#basket-view-parts-template').html();
                        var template = vars.getTemplate(templateContent);
                        var htmlResult = '';
                        var curSymbol = vars._appData.Settings.Currency.Code;
                        var sum = 0;
                        for (var i = 0; i < icount; i++) {
                            curSymbol = items[i].Goods.Currency.Symbol;
                            items[i].deleteLabel = vars._statres("button$label$delete");
                            items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 1);
                            sum += items[i].Sum;
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#basket-view-parts').html(htmlResult);
                        self.Model.set("TotalSumValue", '' + window.numberToString(sum, 2) + ' ' + curSymbol);
                        self.Model.set("curSymbol", curSymbol);
                        htmlResult = '';
                        templateContent = self.View.find('#basket-view-delivery-template').html();
                        template = vars.getTemplate(templateContent);
                        items = responseData.Data.Deliveries;
                        sum = 0;
                        for (var i = 0, icount_1 = items.length; i < icount_1; i++) {
                            if (self.deliveryId == items[i].Id) {
                                sum = items[i].TotalAmount;
                            }
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#basket-view-delivery').html(htmlResult);
                        self.Model.set("TotalSum", '' + window.numberToString(sum, 2) + ' ' + curSymbol);
                        if (self.deliveryId !== 0) {
                            self.View.find('#basket-view-delivery-input-' + self.deliveryId).prop('checked', true);
                        }
                        self.rebindModel();
                        //M.updateTextFields();
                        self.createCardsItems();
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                };
                Index.prototype.updatePositions = function (id, isRemove, qty) {
                    var data = this.Model.get("basketData");
                    var items = data.get("Positions");
                    var sum = 0;
                    var curSymbol = vars._appData.Settings.Currency.Code;
                    for (var i = items.length - 1; i >= 0; i--) {
                        curSymbol = items[i].Goods.Currency.Symbol;
                        if (isRemove === true && items[i].Goods.Id === id) {
                            items.splice(i, 1);
                        }
                        else {
                            if (items[i].Goods.Id === id) {
                                items[i].Quantity = qty;
                            }
                            items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 1);
                            sum += items[i].Sum;
                        }
                    }
                    this.Model.set("TotalSumValue", '' + window.numberToString(sum, 2) + ' ' + vars._appData.Settings.Currency.Code);
                    this.Model.set("TotalSumValue", '' + window.numberToString(sum, 2) + ' ' + curSymbol);
                    data.set("Positions", items);
                    //this.Model.set("basketData", items);
                };
                Index.prototype.deliveryClick = function (e) {
                    var self = this;
                    var cur = $(e.currentTarget);
                    var id = cur.data('id');
                    if (this.deliveryId == id)
                        return;
                    if (this.deliveryId != 0)
                        self.View.find('#basket-view-delivery').find("#basket-view-delivery-input-" + self.deliveryId).prop('checked', false);
                    self.deliveryId = id;
                    cur.find("#basket-view-delivery-input-" + self.deliveryId).prop('checked', true);
                    var data = this.Model.get("basketData");
                    var items = data.Deliveries;
                    for (var i = 0, icount = items.length; i < icount; i++) {
                        if (self.deliveryId == items[i].Id) {
                            self.Model.set("TotalSum", '' + window.numberToString(items[i].TotalAmount, 2) + ' ' + this.Model.get("curSymbol"));
                        }
                    }
                    e.preventDefault();
                    return false;
                };
                Index.prototype.deletePart = function (e) {
                    vars._app.ShowLoading();
                    var self = this;
                    var id = $(e.currentTarget).data('id');
                    self.BasketService.Delete(id, function (responseData) {
                        if (responseData.Result === 0) {
                            $("#basket-view-item-" + id).remove();
                            self.updatePositions(id, true, 0);
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
                            self.updatePositions(id, false, qty);
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
                    this.SearchButtonClick = this.createClickEvent("basket-search-btn", this.searchButtonClick);
                    this.DoneButtonClick = this.createClickEvent("basket-done-btn", this.doneButtonClick);
                };
                Index.prototype.createCardsItems = function () {
                    var self = this;
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
                    self.deliveryCards = self.View.find(".basket-view-delivery-card");
                    if (self.deliveryCards) {
                        self.proxyDeliveryClick = $.proxy(self.deliveryClick, self);
                        self.deliveryCards.on('click', self.proxyDeliveryClick);
                    }
                };
                Index.prototype.destroyCardsItems = function () {
                    if (this.deliveryCards)
                        this.deliveryCards.off('click', this.proxyDeliveryClick);
                    if (this.deleteBtn)
                        this.deleteBtn.off('click', this.proxyDelete);
                    if (this.qtyForm)
                        this.qtyForm.off('submit', this.proxyQtyForm);
                };
                Index.prototype.destroyEvents = function () {
                    this.destroyCardsItems();
                    this.destroyClickEvent("basket-search-btn", this.SearchButtonClick);
                    this.destroyClickEvent("basket-done-btn", this.DoneButtonClick);
                };
                Index.prototype.searchButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "search/index" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.doneButtonClick = function (e) {
                    if (this.Validate() === true) {
                        vars._app.OpenController({ urlController: "basket/delivery", backController: this });
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.Validate = function () {
                    if (this.deliveryId == 0) {
                        M.toast({ html: vars._statres('msg$delivery$choosecompany') });
                        return false;
                    }
                    return true;
                };
                return Index;
            }(base.Controller.Base));
            Basket.Index = Index;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/index", function (module) { return new module.Controller.Basket.Index(); });
});
//# sourceMappingURL=index.js.map