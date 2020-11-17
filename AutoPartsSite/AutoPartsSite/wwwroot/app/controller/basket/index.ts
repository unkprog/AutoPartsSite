import vars = require('app/core/variables');
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

                "labelContinueShopping": vars._statres("button$label$continueShopping"),
                "labelCheckout": vars._statres("button$label$checkout"),
                "basketData": {}
            });
        }


        protected OnViewInit(): void {
            vars._app.ShowLoading();
            let self = this;

            this.BasketService.View((responseData) => {
                self.setupBasketData(responseData);
                vars._app.HideLoading();
            });
        }

        private qtyForm: JQuery;
        private proxyQtyForm;
        private deleteBtn: JQuery;
        private proxyDelete;

        private setupBasketData(responseData) {
            let self = this;
            if (responseData.Result === 0) {

                this.Model.set("basketData", responseData.Data.Positions);

                let templateContent = self.View.find('#basket-view-parts-template').html();
                let template = vars.getTemplate(templateContent);
                let htmlResult = '';
                let items: any[] = responseData.Data.Positions;

                let sum: number = 0;
                for (let i = 0, icount = items.length; i < icount; i++) {
                    items[i].deleteLabel = vars._statres("button$label$delete");
                    items[i].Sum = items[i].Quantity * (items[i].Price && items[i].Price > 0 ? items[i].Price : 1);
                    sum += items[i].Sum;
                    htmlResult = (htmlResult + template(items[i]));
                }

                self.View.find('#basket-view-parts').html(htmlResult);
                self.Model.set("TotalSumValue", '' + sum + "$");
                self.Model.set("TotalSumValue", '' + window.numberToString(sum, 2) + ' ' + vars._appData.Settings.Currency.Code);

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
        }

        private updatePositions(id: number, isRemove: boolean, qty: number) {
            let items: any[] = this.Model.get("basketData");
            let sum: number = 0;
            let currencySymbol: string = '$';
          
            for (let i = items.length - 1; i >= 0; i--) {
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
            this.Model.set("basketData", items);
        }

        private deletePart(e: any): boolean {
            vars._app.ShowLoading();
            let self = this;
            let id: number = $(e.currentTarget).data('id');
            self.BasketService.Delete(id, (responseData) => {
                if (responseData.Result === 0) {
                    $("#basket-view-item-" + id).remove();
                    self.updatePositions(id, true, 0);
                    let count: number = responseData.Data;
                    if (count > 0) $('.app-basket-counter').html('' + count).show();
                    else $('.app-basket-counter').html('0').hide();
                }
                else
                    vars._app.ShowError(responseData.Error);
                vars._app.HideLoading();
            });
            e.preventDefault();
            return false;
        }

        private changeQty(e: any): boolean {
            vars._app.ShowLoading();
            let self = this;

            let formid: string = e.currentTarget.id;
            let id: number = parseInt(formid.replace('basket-qty-form-', ''));
            let qty: number = parseFloat($(e.target).find('#basket-qty-' + id).val() as string);
            let price: number = parseFloat($(e.target).parent().find('#basket-price-' + id).val() as string);

            self.BasketService.Update(id, qty, (responseData) => {
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
        }

        protected createEvents(): void {
            this.SearchButtonClick = this.createClickEvent("basket-search-btn", this.searchButtonClick);
            this.DoneButtonClick = this.createClickEvent("basket-done-btn", this.doneButtonClick);
        }

        protected destroyEvents(): void {
            if (this.deleteBtn) this.deleteBtn.off('click', this.proxyDelete);
            if (this.qtyForm) this.qtyForm.off('submit', this.proxyQtyForm);

            this.destroyClickEvent("basket-search-btn", this.SearchButtonClick);
            this.destroyClickEvent("basket-done-btn", this.DoneButtonClick);
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
            vars._app.OpenController({ urlController: "basket/delivery" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}

vars.registerController("basket/index", function (module: any): Interfaces.IController { return new module.Controller.Basket.Index(); });