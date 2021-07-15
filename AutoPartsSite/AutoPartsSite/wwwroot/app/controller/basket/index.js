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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/basketservice", "app/core/utils"], function (require, exports, vars, base, bsk, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Basket;
        (function (Basket) {
            var Index = (function (_super) {
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
                    var options = { Url: "/app/controller/basket/index.html", Id: "basket-view", Page: "/basket/index" };
                    return options;
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$basket"),
                        "labelEmptyBasket": vars._statres("label$empty$basket"),
                        "labelDelivery": vars._statres("label$shipping"),
                        "labelBrand": vars._statres("label$brand"),
                        "labelPartNumber": vars._statres("label$partnumber"),
                        "labelName": vars._statres("label$description"),
                        "labelCountry": vars._statres("label$country"),
                        "labelShipIn": vars._statres("label$shipin"),
                        "labelDimensions": vars._statres("label$dimensions"),
                        "labelWeight": vars._statres("label$weight"),
                        "labelQty": vars._statres("label$qty"),
                        "labelPrice": vars._statres("label$price"),
                        "labelSum": vars._statres("label$amount"),
                        "labelPromoCode": vars._statres("label$promocode"),
                        "labelApplyPromocode": vars._statres("label$promocode$apply"),
                        "labelTotalSum": vars._statres("label$items$subtotal"),
                        "labelPriceHasChanged": vars._statres("label$price$haschanged"),
                        "labelPcs": vars._statres("label$pcs"),
                        "labelWas": vars._statres("label$qty$was"),
                        "labelNoLongerAvailabile": vars._statres("label$no$longeravailable"),
                        "labelSave": vars._statres("label$saving"),
                        "TotalSumValue": "0$",
                        "curSymbol": "$",
                        "labelTotalVatDelivery": vars._statres("label$total$taxvat"),
                        "labelTotalSumDelivery": vars._statres("label$total$estimated"),
                        "TotalVat": "0$",
                        "TotalSum": "0$",
                        "labelSumParts": vars._statres("label$sum$parts") + ":",
                        "labelDeliveryAmount": vars._statres("label$delivery$ammount") + ":",
                        "labelVatAmount": vars._statres("label$vat") + ":",
                        "labelTotalAmount": vars._statres("label$total") + ":",
                        "labelDeliveryDays": vars._statres("label$delivery$days") + ":",
                        "labelContinueShopping": vars._statres("button$label$continueShopping"),
                        "labelCheckout": vars._statres("button$label$checkout"),
                        "basketData": {}
                    });
                };
                Index.prototype.ViewInit = function (view) {
                    _super.prototype.ViewInit.call(this, view);
                    vars._appData.IsBasketCheckOut = false;
                    return false;
                };
                Index.prototype.OnViewInit = function () {
                    vars._app.ShowLoading(true);
                    var self = this;
                    self.isShowPromocodeApplyMsg = true;
                    self.BasketService.View(function (responseData) { return self.endCommand(responseData); });
                };
                Index.prototype.endCommand = function (responseData) {
                    var self = this;
                    self.BasketService.Count(function (responseData) { return self.setBasketCount(responseData); });
                    if (responseData.Result === 0)
                        self.setupBasketData(responseData);
                    else
                        vars._app.ShowError(responseData.Error);
                    self.isShowPromocodeApplyMsg = false;
                    vars._app.HideLoading();
                };
                Index.prototype.setBasketCount = function (responseData) {
                    if (responseData.Result === 0) {
                        var count = responseData.Data;
                        if (count > 0)
                            $('.app-basket-counter').html('' + count).show();
                        else
                            $('.app-basket-counter').html('0').hide();
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                    vars._app.HideLoading();
                };
                Index.prototype.setupBasketData = function (responseData) {
                    var self = this;
                    self.destroyCardsItems();
                    self.View.find("#basket-view-parts-table").hide();
                    self.View.find('#basket-view-additional').hide();
                    self.View.find("#basket-view-parts-empty").show();
                    if (responseData.Result === 0) {
                        this.Model.set("basketData", responseData.Data);
                        var items = responseData.Data.Positions;
                        var icount = items.length;
                        var templateContent = self.View.find('#basket-view-parts-template').html();
                        var templateContentTable = self.View.find('#basket-view-parts-table-template').html();
                        var template = vars.getTemplate(templateContent);
                        var templateTable = vars.getTemplate(templateContentTable);
                        var htmlResult = '', tmlTableResult = '';
                        var curSymbol = vars._appData.Settings.Currency.Code;
                        var isSymbolLeft = false;
                        var sum = 0;
                        for (var i = 0; i < icount; i++) {
                            if (i == 0) {
                                this.Model.set("labelDelivery", (vars._statres("label$delivery$to") + " " + items[i].Goods.Country.Name));
                            }
                            curSymbol = items[i].Goods.Currency.Symbol;
                            isSymbolLeft = items[i].Goods.Currency.ShowLeft;
                            items[i].deleteLabel = vars._statres("button$label$delete");
                            items[i].OldQtyLabel = '' + items[i].OldQty + ' ' + self.Model.get('labelPcs');
                            sum += items[i].CartAmount;
                            htmlResult = (htmlResult + template(items[i]));
                            tmlTableResult = (tmlTableResult + templateTable(items[i]));
                        }
                        tmlTableResult += '<tr style="font-weight:bold;font-size:1.1rem;">';
                        tmlTableResult += '<td colspan="6" class="bold" style="color:rgba(0,0,0,.5);font-size:1.1rem;width:79%;">' + vars._statres("label$items$subtotal") + '</td>';
                        tmlTableResult += '<td style="width:13%;">' + (isSymbolLeft === true ? curSymbol + ' ' : '') + window.numberToString(sum, 2) + (isSymbolLeft === false ? curSymbol + ' ' : '') + '</td>';
                        tmlTableResult += '<td style="width:8%;"></td></tr>';
                        if (icount > 0) {
                            self.View.find('#basket-view-additional').show();
                            self.View.find("#basket-view-parts-empty").hide();
                            self.View.find('#basket-view-parts-rows').html(htmlResult);
                            self.View.find('#basket-view-parts-table-rows').html(tmlTableResult);
                            self.View.find("#basket-view-parts-table").show();
                        }
                        if (isSymbolLeft === true)
                            self.Model.set("TotalSumValue", curSymbol + ' ' + window.numberToString(sum, 2));
                        else
                            self.Model.set("TotalSumValue", window.numberToString(sum, 2) + ' ' + curSymbol);
                        self.Model.set("curSymbol", curSymbol);
                        htmlResult = '';
                        templateContent = self.View.find('#basket-view-delivery-template').html();
                        template = vars.getTemplate(templateContent);
                        items = responseData.Data.Deliveries;
                        sum = 0;
                        var vat = 0;
                        self.deliveryId = responseData.Data.Header.DeliveryTariffID;
                        for (var i = 0, icount_1 = items.length; i < icount_1; i++) {
                            if (self.deliveryId == items[i].Id) {
                                vat = items[i].VatAmount;
                                sum = items[i].TotalAmount;
                            }
                            htmlResult = (htmlResult + template(items[i]));
                        }
                        self.View.find('#basket-view-delivery').html(htmlResult);
                        if (isSymbolLeft === true)
                            self.Model.set("TotalVat", curSymbol + ' ' + window.numberToString(vat, 2));
                        else
                            self.Model.set("TotalVat", window.numberToString(vat, 2) + ' ' + curSymbol);
                        if (isSymbolLeft === true)
                            self.Model.set("TotalSum", curSymbol + ' ' + window.numberToString(sum, 2));
                        else
                            self.Model.set("TotalSum", window.numberToString(sum, 2) + ' ' + curSymbol);
                        if (self.deliveryId !== 0) {
                            var deliveryitems = self.View.find('.card-delivery-item-row');
                            for (var i = 0, icount_2 = deliveryitems && deliveryitems.length ? deliveryitems.length : 0; i < icount_2; i++) {
                                var cardDelivery = $(self.View.find('.card-delivery-item-row')[i]);
                                var did = cardDelivery.parent().data('id');
                                if (self.deliveryId == did) {
                                    vat = items[i].VatAmount;
                                    sum = items[i].TotalAmount;
                                    self.View.find('#basket-view-delivery-input-' + self.deliveryId).prop('checked', true);
                                    cardDelivery.addClass('card-delivery-item-row-selected');
                                }
                            }
                        }
                        self.rebindModel();
                        self.createCardsItems();
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                    M.updateTextFields();
                    if (self.isShowPromocodeApplyMsg == true) {
                        if (utils.isNullOrEmpty(responseData.Data.Header.PromoCouponMessage) == false)
                            M.toast({ html: responseData.Data.Header.PromoCouponMessage });
                        self.isShowPromocodeApplyMsg = false;
                    }
                };
                Index.prototype.deliveryClick = function (e) {
                    var self = this;
                    var cur = $(e.currentTarget);
                    var id = cur.data('id');
                    vars._app.ShowLoading(false);
                    if (this.deliveryId == id)
                        self.BasketService.SetDeliveryTariffID(0, function (responseData) { return self.endCommand(responseData); });
                    else
                        self.BasketService.SetDeliveryTariffID(id, function (responseData) { return self.endCommand(responseData); });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.deletePart = function (e) {
                    vars._app.ShowLoading(false);
                    var self = this;
                    var id = $(e.currentTarget).data('id');
                    self.BasketService.Delete(id, function (responseData) { return self.endCommand(responseData); });
                    e.preventDefault();
                    return false;
                };
                Index.prototype.changeQty = function (e) {
                    vars._app.ShowLoading(false);
                    var self = this;
                    var formid = e.currentTarget.id;
                    var id = parseInt(formid.replace('basket-qty-form-table-', '').replace('basket-qty-form-', ''));
                    var qtyJq = $(e.target).find('#basket-qty-' + id);
                    if (!qtyJq || qtyJq.length < 1)
                        qtyJq = $(e.target).find('#basket-qty-table-' + id);
                    var qtyStr = qtyJq.val();
                    var qty = parseFloat(qtyStr);
                    self.BasketService.Update(id, qty, function (responseData) { return self.endCommand(responseData); });
                    e.preventDefault();
                    return false;
                };
                Index.prototype.createEvents = function () {
                    this.ApplyPromocodeButtonClick = this.createClickEvent("basket-promocode-btn", this.applyPromocodeButtonClick);
                    this.proxyApplyPromo = $.proxy(this.applyPromoEnter, this);
                    this.View.find("#basket-promocode").on("keydown", this.proxyApplyPromo);
                    this.ClearPromocodeButtonClick = this.createClickEvent("basket-promocode-clear", this.clearPromocodeButtonClick);
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
                    if (this.proxyApplyPromo)
                        this.View.find("#basket-promocode").off("keydown", this.proxyApplyPromo);
                    this.destroyClickEvent("basket-done-btn", this.DoneButtonClick);
                    this.destroyClickEvent("basket-promocode-clear", this.ClearPromocodeButtonClick);
                    this.destroyClickEvent("basket-promocode-btn", this.ApplyPromocodeButtonClick);
                    this.destroyClickEvent("basket-search-btn", this.SearchButtonClick);
                };
                Index.prototype.applyPromocodeButtonClick = function (e) {
                    var self = this;
                    var promoCode = self.View.find('#basket-promocode').val();
                    self.isShowPromocodeApplyMsg = true;
                    self.BasketService.SetPromocode(promoCode, function (responseData) { return self.endCommand(responseData); });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.applyPromoEnter = function (e) {
                    var self = this;
                    if (e.which == 13) {
                        self.applyPromocodeButtonClick(e);
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                };
                Index.prototype.clearPromocodeButtonClick = function (e) {
                    var self = this;
                    self.View.find('#basket-promocode').val('');
                    self.isShowPromocodeApplyMsg = true;
                    self.BasketService.SetPromocode('', function (responseData) { return self.endCommand(responseData); });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.searchButtonClick = function (e) {
                    vars._app.OpenController({ urlController: "search/index" });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                Index.prototype.doneButtonClick = function (e) {
                    if (this.Validate() === true) {
                        if (vars._appData.Identity.Auth !== true) {
                            vars._appData.IsBasketCheckOut = true;
                            vars._app.OpenController({ urlController: "account/login" });
                        }
                        else
                            vars._app.OpenController({ urlController: "basket/delivery" });
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