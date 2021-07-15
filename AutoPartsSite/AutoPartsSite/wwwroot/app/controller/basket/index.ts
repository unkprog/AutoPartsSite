import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');
import utils = require('app/core/utils');

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
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/basket/index.html", Id: "basket-view", Page: "/basket/index" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$basket"),
                "labelEmptyBasket": vars._statres("label$empty$basket"),
                "labelDelivery": vars._statres("label$shipping"),
                "labelBrand": vars._statres("label$brand"), // + ":",
                "labelPartNumber": vars._statres("label$partnumber"), // + ":",
                "labelName": vars._statres("label$description"), // + ":",
                "labelCountry": vars._statres("label$country"), // + ":",
                "labelShipIn": vars._statres("label$shipin"), // + ":",
                "labelDimensions": vars._statres("label$dimensions"), // + ":",
                "labelWeight": vars._statres("label$weight"), // + ":",
                "labelQty": vars._statres("label$qty"), // + ":",
                "labelPrice": vars._statres("label$price"), // + ":",
                "labelSum": vars._statres("label$amount"), // + ":",
                "labelPromoCode": vars._statres("label$promocode"), // + ":",
                "labelApplyPromocode": vars._statres("label$promocode$apply"),
                "labelTotalSum": vars._statres("label$items$subtotal"), // + ":",
                "labelPriceHasChanged": vars._statres("label$price$haschanged"), //+ ":",
                "labelPcs": vars._statres("label$pcs"),
                "labelWas": vars._statres("label$qty$was"), // + ":",
                "labelNoLongerAvailabile": vars._statres("label$no$longeravailable"),
                "labelSave": vars._statres("label$saving"), // + ":",
                "TotalSumValue": "0$",
                "curSymbol": "$",
                "labelTotalVatDelivery": vars._statres("label$total$taxvat"), // + ":",
                "labelTotalSumDelivery": vars._statres("label$total$estimated"), // + ":",
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
            vars._appData.IsBasketCheckOut = false;
            return false;
        }

        protected OnViewInit(): void {
            vars._app.ShowLoading(true);
            let self = this;
            self.isShowPromocodeApplyMsg = true;
            self.BasketService.View((responseData) => self.endCommand(responseData));
        }

        private endCommand(responseData) {
            let self = this;

            self.BasketService.Count((responseData) => self.setBasketCount(responseData));
            if (responseData.Result === 0)
                self.setupBasketData(responseData);
            else
                vars._app.ShowError(responseData.Error);
            self.isShowPromocodeApplyMsg = false;
            vars._app.HideLoading();

            //if (vars._appData.IsBasketCheckOut === true && vars._appData.Identity.Auth === true) {
            //    vars._appData.IsBasketCheckOut = false;
            //    vars._app.OpenController({ urlController: "basket/delivery" });
            //}
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
        private proxyApplyPromo;
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

                let templateContent = self.View.find('#basket-view-parts-template').html();
                let templateContentTable = self.View.find('#basket-view-parts-table-template').html();
                
                let template = vars.getTemplate(templateContent);
                let templateTable = vars.getTemplate(templateContentTable);
                let htmlResult = '', tmlTableResult = '';
                let curSymbol: string = vars._appData.Settings.Currency.Code;
                let isSymbolLeft: boolean = false;

                let sum: number = 0;
                for (let i = 0; i < icount; i++) {
                    if (i == 0) {
                        this.Model.set("labelDelivery", (vars._statres("label$delivery$to") + " " + items[i].Goods.Country.Name));
                    }

                    curSymbol = items[i].Goods.Currency.Symbol;
                    isSymbolLeft = items[i].Goods.Currency.ShowLeft;
                    items[i].deleteLabel = vars._statres("button$label$delete");
                    items[i].OldQtyLabel = '' + items[i].OldQty + ' ' + self.Model.get('labelPcs');
                    //items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 0);
                    //items[i].SumOld = items[i].Quantity * (items[i].OldCartPrice && items[i].OldCartPrice > 0 ? items[i].OldCartPrice : 0);
                    sum += items[i].CartAmount;
                    htmlResult = (htmlResult + template(items[i]));
                    tmlTableResult = (tmlTableResult + templateTable(items[i]))
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
                //Items Subtotal

                htmlResult = '';
                templateContent = self.View.find('#basket-view-delivery-template').html();
                template = vars.getTemplate(templateContent);
                items = responseData.Data.Deliveries;
                sum = 0;
                let vat: number = 0;
                self.deliveryId = responseData.Data.Header.DeliveryTariffID;
                for (let i = 0, icount = items.length; i < icount; i++) {
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
                    let deliveryitems = self.View.find('.card-delivery-item-row');
                    for (let i = 0, icount = deliveryitems && deliveryitems.length ? deliveryitems.length : 0; i < icount; i++) {
                        let cardDelivery = $(self.View.find('.card-delivery-item-row')[i]);
                        let did = cardDelivery.parent().data('id');
                        if (self.deliveryId == did) {
                            vat = items[i].VatAmount;
                            sum = items[i].TotalAmount;
                            self.View.find('#basket-view-delivery-input-' + self.deliveryId).prop('checked', true);
                            cardDelivery.addClass('card-delivery-item-row-selected');
                        }
                    }

                    //$(self.View.find('.card-delivery-item-row')[1]).parent().data('id')

                    //let cardDelivery = self.View.find('#basket-view-delivery-input-' + self.deliveryId);
                    //cardDelivery.find('.card-delivery-item-row').addClass('card-delivery-item-row-selected');
                    //cardDelivery.prop('checked', true);
                }
                
                self.rebindModel();
                self.createCardsItems();
            }
            else
                vars._app.ShowError(responseData.Error);

            M.updateTextFields();

            if (self.isShowPromocodeApplyMsg == true) {
                //M.toast({ html: vars._statres("mesage$promocode$applied") });
                if (utils.isNullOrEmpty(responseData.Data.Header.PromoCouponMessage) == false)
                    M.toast({ html: responseData.Data.Header.PromoCouponMessage });
                self.isShowPromocodeApplyMsg = false;
            }
        }

        private deliveryId: number = 0;
        private deliveryClick(e: any): boolean {
            let self = this;
            let cur: JQuery = $(e.currentTarget);
            let id: number = cur.data('id');
            vars._app.ShowLoading(false);
            if (this.deliveryId == id)
                self.BasketService.SetDeliveryTariffID(0, (responseData) => self.endCommand(responseData));
            else
                self.BasketService.SetDeliveryTariffID(id, (responseData) => self.endCommand(responseData));
            e.preventDefault();
            e.stopPropagation();
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
            let id: number = parseInt(formid.replace('basket-qty-form-table-', '').replace('basket-qty-form-', ''));
            let qtyJq: JQuery = $(e.target).find('#basket-qty-' + id);
            if (!qtyJq || qtyJq.length < 1)
                qtyJq = $(e.target).find('#basket-qty-table-' + id);
            let qtyStr: any = qtyJq.val();
            let qty: number = parseFloat(qtyStr);
           
            self.BasketService.Update(id, qty, (responseData) => self.endCommand(responseData));
            e.preventDefault();
            return false;
        }

        protected createEvents(): void {
            this.ApplyPromocodeButtonClick = this.createClickEvent("basket-promocode-btn", this.applyPromocodeButtonClick);

            this.proxyApplyPromo = $.proxy(this.applyPromoEnter, this);
            this.View.find("#basket-promocode").on("keydown", this.proxyApplyPromo);

            this.ClearPromocodeButtonClick = this.createClickEvent("basket-promocode-clear", this.clearPromocodeButtonClick);
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

            if (this.proxyApplyPromo)
                this.View.find("#basket-promocode").off("keydown", this.proxyApplyPromo);


            this.destroyClickEvent("basket-done-btn", this.DoneButtonClick);
            this.destroyClickEvent("basket-promocode-clear", this.ClearPromocodeButtonClick);
            this.destroyClickEvent("basket-promocode-btn", this.ApplyPromocodeButtonClick);
            this.destroyClickEvent("basket-search-btn", this.SearchButtonClick);
        }

        private isShowPromocodeApplyMsg: boolean;
        public ApplyPromocodeButtonClick: { (e: any): void; };
        private applyPromocodeButtonClick(e) {
            let self = this;
            let promoCode: string = self.View.find('#basket-promocode').val() as string;
            self.isShowPromocodeApplyMsg = true;
            self.BasketService.SetPromocode(promoCode, (responseData) => self.endCommand(responseData));
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private applyPromoEnter(e) {
            let self = this;
            if (e.which == 13) {
                self.applyPromocodeButtonClick(e);
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
        
        public ClearPromocodeButtonClick: { (e: any): void; };
        private clearPromocodeButtonClick(e) {
            let self = this;
            self.View.find('#basket-promocode').val('');
            self.isShowPromocodeApplyMsg = true;
            self.BasketService.SetPromocode('', (responseData) => self.endCommand(responseData));
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