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
                "labelDimensions": vars._statres("label$dimensions") + ":",
                "labelQty": vars._statres("label$qty") + ":",
                "labelPrice": vars._statres("label$price") + ":",
                "labelSum": vars._statres("label$sum") + ":"
            });
        }


        protected OnViewInit(): void {
            let self = this;
            this.BasketService.View((responseData) => {
                self.setupBasketData(responseData);
            });
        }

        private qtyForm: JQuery;
        private proxyQtyForm;
        private deleteBtn: JQuery;
        private proxyDelete;

        private setupBasketData(responseData) {
            let self = this;
            if (responseData.Result === 0) {
                let templateContent = self.View.find('#basket-view-parts-template').html();
                let template = vars.getTemplate(templateContent);
                let htmlResult = '';
                let items: any[] = responseData.Data.Positions;

                for (let i = 0, icount = items.length; i < icount; i++) {
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
                }
            }
            else
                vars._app.ShowError(responseData.Error);
        }

        private deletePart(e: any): boolean {
            let self = this;
            e.preventDefault();
            return false;
        }

        private changeQty(e: any): boolean {
            let self = this;

            let formid: string = e.target.id;
            let id: number = parseInt(formid.replace('basket-qty-form-', ''));
            let qty: number = parseFloat($(e.target).find('#basket-qty-' + id).val() as string);
            let price: number = parseFloat($(e.target).parent().find('#basket-price-' + id).val() as string);

            self.BasketService.Update(id, qty, (responseData) => {
                if (responseData.Result === 0)
                    $(e.target).parent().find('#basket-sum-' + id).html('' + (qty * (price && price > 0 ? price : 1)))
                else
                    vars._app.ShowError(responseData.Error);
            });
            e.preventDefault();
            return false;
        }

        protected createEvents(): void {
            
        }

        protected destroyEvents(): void {
            if (this.deleteBtn) this.deleteBtn.off('click', this.proxyDelete);
            if (this.qtyForm) this.qtyForm.off('submit', this.proxyQtyForm);
        }
    }
}

vars.registerController("basket/index", function (module: any): Interfaces.IController { return new module.Controller.Basket.Index(); });