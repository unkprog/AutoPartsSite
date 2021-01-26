﻿import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');

export namespace Controller.Basket {
    export class Index extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/basket/index.html", Id: "basket-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$basket"),
                "labelEmptyBasket": vars._statres("label$empty$basket"),
                "labelDelivery": vars._statres("label$shipping"),
                "labelBrand": vars._statres("label$brand"), // + ":",
                "labelPartNumber": vars._statres("label$partnumber"),
                "labelName": vars._statres("label$name"),
                "labelCountry": vars._statres("label$country") + ":",
                "labelShipIn": vars._statres("label$shipin"), // + ":",
                "labelDimensions": vars._statres("label$dimensions") + ":",
                "labelWeight": vars._statres("label$weight") + ":",
                "labelQty": vars._statres("label$qty"), // + ":",
                "labelPrice": vars._statres("label$price"), // + ":",
                "labelSum": vars._statres("label$sum"), // + ":",
                "labelPromoCode": vars._statres("label$promocode") + ":",
                "labelApplyPromocode": vars._statres("label$promocode$apply"),
                "labelTotalSum": vars._statres("label$items$subtotal") + ":",
                "labelPriceHasChanged": vars._statres("label$price$haschanged") + ":",
                "labelWas": vars._statres("label$qty$was") + ":",
                "labelNoLongerAvailabile": vars._statres("label$no$longeravailable"),
                "labelSave": vars._statres("label$saving") + ":",
                "TotalSumValue": "0$",
                "curSymbol": "$",
                "labelTotalVatDelivery": vars._statres("label$total$taxvat") + ":",
                "labelTotalSumDelivery": vars._statres("label$total$estimated") + ":",
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
        }

        public ViewInit(view: JQuery): boolean {
            super.ViewInit(view);
            return false;
        }

        protected OnViewInit(): void {
            vars._app.ShowLoading(true);
            let self = this;
            self.BasketService.View((responseData) => self.endCommand(responseData));
        }

        private endCommand(responseData) {
            let self = this;

            self.BasketService.Count((responseData) => self.setBasketCount(responseData));
            if (responseData.Result === 0)
                self.setupBasketData(responseData);
            else
                vars._app.ShowError(responseData.Error);
            vars._app.HideLoading();
        }

        private setBasketCount(responseData): void {
            if (responseData.Result === 0) {
                let count: number = responseData.Data;
                if (count > 0) $('.app-basket-counter').html('' + count).show();
                else $('.app-basket-counter').html('0').hide();
            }
            else vars._app.ShowError(responseData.Error);
            vars._app.HideLoading();
        }

        private qtyForm: JQuery;
        private proxyQtyForm;
        private deleteBtn: JQuery;
        private proxyDelete;
        private deliveryCards: JQuery;
        private proxyDeliveryClick;

        private setupBasketData(responseData) {
            let self = this;
            self.destroyCardsItems();

            self.View.find("#basket-view-parts-table").hide();
            self.View.find('#basket-view-additional').hide();
            self.View.find("#basket-view-parts-empty").show();
            //self.View.find('#basket-view-parts').html('<div class="center" style="font-size: 1.7rem;">' + vars._statres("label$empty$basket") + '</div>');
            
            if (responseData.Result === 0) {

                this.Model.set("basketData", responseData.Data);

                let items: any[] = responseData.Data.Positions;
                let icount = items.length;
                if (icount > 0)
                    self.View.find('#basket-view-additional').show();
             

                let templateContent = self.View.find('#basket-view-parts-template').html();
                let template = vars.getTemplate(templateContent);
                let htmlResult = '';
                let curSymbol: string = vars._appData.Settings.Currency.Code;

                let sum: number = 0;
                for (let i = 0; i < icount; i++) {
                    if (i == 0) {
                        this.Model.set("labelDelivery", (vars._statres("label$delivery$to") + " " + items[i].Goods.Country.Name));
                    }

                    curSymbol = items[i].Goods.Currency.Symbol;
                    items[i].deleteLabel = vars._statres("button$label$delete");
                    items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 1);
                    sum += items[i].Sum;
                    htmlResult = (htmlResult + template(items[i]));
                }

                self.View.find("#basket-view-parts-empty").hide();
                self.View.find('#basket-view-parts-rows').html(htmlResult);
                self.View.find("#basket-view-parts-table").show();
                self.Model.set("TotalSumValue", '' + window.numberToString(sum, 2) + ' ' + curSymbol);
                self.Model.set("curSymbol", curSymbol);
                //Items Subtotal

                htmlResult = '';
                templateContent = self.View.find('#basket-view-delivery-template').html();
                template = vars.getTemplate(templateContent);
                items = responseData.Data.Deliveries;
                sum = 0;
                let vat: number = 0;
                for (let i = 0, icount = items.length; i < icount; i++) {
                    if (self.deliveryId == items[i].Id) {
                        vat = items[i].VatAmount;
                        sum = items[i].TotalAmount;
                    }
                    htmlResult = (htmlResult + template(items[i]));
                }
                self.View.find('#basket-view-delivery').html(htmlResult);
                self.Model.set("TotalVat", '' + window.numberToString(vat, 2) + ' ' + curSymbol);
                self.Model.set("TotalSum", '' + window.numberToString(sum, 2) + ' ' + curSymbol);
                if (self.deliveryId !== 0) {
                    self.View.find('#basket-view-delivery-input-' + self.deliveryId).prop('checked', true);
                }
                
                self.rebindModel();
                self.createCardsItems();
            }
            else
                vars._app.ShowError(responseData.Error);

            M.updateTextFields();
        }

        private deliveryId: number = 0;
        private deliveryClick(e: any): boolean {
            let self = this;
            let cur: JQuery = $(e.currentTarget);
            let id: number = cur.data('id');

            //if (this.deliveryId == id)
            //    return;
            if (this.deliveryId != 0)
                self.View.find('#basket-view-delivery').find("#basket-view-delivery-input-" + self.deliveryId).prop('checked', false);

            if (this.deliveryId == id) {
                self.deliveryId = 0;
                self.Model.set("TotalSum", '' + window.numberToString(0, 2) + ' ' + this.Model.get("curSymbol"));
                self.Model.set("TotalVat", '' + window.numberToString(0, 2) + ' ' + this.Model.get("curSymbol"));
            }
            else {
                self.deliveryId = id;
                cur.find("#basket-view-delivery-input-" + self.deliveryId).prop('checked', true);

                let data = this.Model.get("basketData");
                let items: any[] = data.Deliveries;

                for (let i = 0, icount = items.length; i < icount; i++) {
                    if (self.deliveryId == items[i].Id) {
                        self.Model.set("TotalVat", '' + window.numberToString(items[i].VatAmount, 2) + ' ' + this.Model.get("curSymbol"));
                        self.Model.set("TotalSum", '' + window.numberToString(items[i].TotalAmount, 2) + ' ' + this.Model.get("curSymbol"));
                    }
                }
            }

            e.preventDefault();
            return false;
        }

        private deletePart(e: any): boolean {
            vars._app.ShowLoading(false);
            let self = this;
            let id: number = $(e.currentTarget).data('id');
            self.BasketService.Delete(id, (responseData) => self.endCommand(responseData));
            e.preventDefault();
            return false;
        }

        private changeQty(e: any): boolean {
            vars._app.ShowLoading(false);
            let self = this;

            let formid: string = e.currentTarget.id;
            let id: number = parseInt(formid.replace('basket-qty-form-', ''));
            let qty: number = parseFloat($(e.target).find('#basket-qty-' + id).val() as string);
           
            self.BasketService.Update(id, qty, (responseData) => self.endCommand(responseData));
            e.preventDefault();
            return false;
        }

        protected createEvents(): void {
            this.ApplyPromocodeButtonClick = this.createClickEvent("basket-promocode-btn", this.applyPromocodeButtonClick);
            this.SearchButtonClick = this.createClickEvent("basket-search-btn", this.searchButtonClick);
            this.DoneButtonClick = this.createClickEvent("basket-done-btn", this.doneButtonClick);
        }

        private createCardsItems() {
            let self = this;
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
        }

        private destroyCardsItems() {
            if (this.deliveryCards) this.deliveryCards.off('click', this.proxyDeliveryClick);
            if (this.deleteBtn) this.deleteBtn.off('click', this.proxyDelete);
            if (this.qtyForm) this.qtyForm.off('submit', this.proxyQtyForm);
        }

        protected destroyEvents(): void {
            this.destroyCardsItems();

            this.destroyClickEvent("basket-search-btn", this.SearchButtonClick);
            this.destroyClickEvent("basket-done-btn", this.DoneButtonClick);
            this.destroyClickEvent("basket-promocode-btn", this.ApplyPromocodeButtonClick);
        }

        public ApplyPromocodeButtonClick: { (e: any): void; };
        private applyPromocodeButtonClick(e) {
            let self = this;
            let promoCode: string = self.View.find('#basket-promocode').val() as string;
            self.BasketService.SetPromocode(promoCode, (responseData) => self.endCommand(responseData));
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public SearchButtonClick: { (e: any): void; };
        private searchButtonClick(e) {
            vars._app.OpenController({ urlController: "search/index" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public DoneButtonClick: { (e: any): void; };
        private doneButtonClick(e) {
            if (this.Validate() === true) {
                vars._app.OpenController({ urlController: "basket/delivery", backController: this });
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private Validate(): boolean {
            if (this.deliveryId == 0) {
                M.toast({ html: vars._statres('msg$delivery$choosecompany') });
                return false;
            }
            return true;
        }
    }
}

vars.registerController("basket/index", function (module: any): Interfaces.IController { return new module.Controller.Basket.Index(); });