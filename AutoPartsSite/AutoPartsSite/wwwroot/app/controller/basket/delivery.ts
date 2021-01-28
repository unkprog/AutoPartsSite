import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');

export namespace Controller.Basket {
    export class Delivery extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/basket/delivery.html", Id: "delivery-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$delivery"),
                "labelPayment": vars._statres("label$payment"),
                "labelBack": vars._statres("label$back"),
                "labelCheckout": vars._statres("button$label$сheckout"),
                "labelTotalSumValue": 0,
                "labelTotalSumDelivery": 0,
                "labelTotalSum": 0
            });
        }

        public ViewInit(view: JQuery): boolean {
            super.ViewInit(view);
            return false;
        }

        protected OnViewInit(): void {
            vars._app.ShowLoading(true);
            let self = this;

            this.BasketService.DeliveryData((responseData) => {

                if (responseData.Result === 0) {
                    self.setupDeliveryData(responseData);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        private setupDeliveryData(responseData) {
            let settings: Interfaces.Model.ISettings = vars._appData.Settings;
            let countries: Interfaces.Model.IReferenceNamedDbModel[] = responseData.Data;

            let html: string = '';
            for (let i = 0, icount = countries.length; i < icount; i++) {
                html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                html = html + countries[i].Code + ' - ' + countries[i].Name + '</option>';
            }
            $('#delivery-view-country').html(html);
            this.View.find('select').formSelect();
        }   
        
        protected createEvents(): void {
            this.CheckoutButtonClick = this.createClickEvent("delivery-checkout-btn", this.checkoutButtonClick);
            this.PaymentButtonClick = this.createClickEvent("delivery-payment-btn", this.paymentButtonClick);
            this.BackButtonClick = this.createClickEvent("delivery-back-btn", this.backButtonClick);

            
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("delivery-back-btn", this.BackButtonClick);
            this.destroyClickEvent("delivery-payment-btn", this.PaymentButtonClick);
            this.destroyClickEvent("delivery-checkout-btn", this.CheckoutButtonClick);
        }

        public BackButtonClick: { (e: any): void; };
        private backButtonClick(e) {
            vars._app.ControllerBack(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public PaymentButtonClick: { (e: any): void; };
        private paymentButtonClick(e) {
            vars._app.OpenController({ urlController: "basket/payment" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public CheckoutButtonClick: { (e: any): void; };
        private checkoutButtonClick(e) {
            let delivery: Interfaces.Model.IBasketDeilvery;
            if (this.validate(delivery)) {
                this.BasketService.SetDelivery(delivery, (responseData) => {
                    if (responseData.Result === 0) {

                        
                        vars._app.OpenController({ urlController: "basket/index" });
                    }
                    else {
                        vars._app.ShowError(responseData.Error);
                    }
                    vars._app.HideLoading();
                });

                
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private validate(delivery: Interfaces.Model.IBasketDeilvery): boolean {
            let result: boolean = false;

            return result;
        }
    }
}

vars.registerController("basket/delivery", function (module: any): Interfaces.IController { return new module.Controller.Basket.Delivery(); });