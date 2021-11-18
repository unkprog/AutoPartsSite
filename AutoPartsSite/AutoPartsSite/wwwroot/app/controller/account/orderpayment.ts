import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');
import cms = require('app/services/cmsservice')

export namespace Controller.Account {
    export class OrderPayment extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
            this.cmsService = new cms.Services.CmsService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }
        private cmsService: cms.Services.CmsService;
        public get CmsService(): cms.Services.CmsService {
            return this.cmsService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/orderpayment.html", Id: "orderpayment-view", Page: "/account/orderpayment" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$payment"),
                "labelTerms": vars._statres("label$terms"),
                "labelContinueShopping": vars._statres("button$label$continueShopping"),
                "labelTermsConditions": vars._statres("label$termsconditions"),
                "labelPay": vars._statres("button$label$pay"),
                "labelOk": vars._statres("button$label$ok"),
                "labelBack": vars._statres("label$back"),
                "IsAcceptTC": false,
                "payCardId": 0,
                "orderId": 0,
                "isBasketCheckOut": false,
                "isOrderCheckOut": true,
            });
        }

        private loadPayments(): void {
            let self = this;
            self.BasketService.PaymentList((responseData) => {
                if (responseData.Result === 0) {

                    self.destroyPayCardItems();

                    let templateContent = self.View.find('#orderpayment-view-info-type-template').html();
                    let template = vars.getTemplate(templateContent);
                    let htmlResult = '';
                    let items: [] = responseData.Data;

                    for (let i = 0, icount = items.length; i < icount; i++) {
                        htmlResult = (htmlResult + template(items[i]));
                    }

                    self.View.find('#orderpayment-view-info').html(htmlResult);
                    self.createCardsItems();
                }
                else
                    vars._app.ShowError(responseData.Error);
            });
        }

        protected OnViewInit(): void {
            this.Model.set("orderId", vars._appData.OrderId);
            this.Model.set("isBasketCheckOut", vars._appData.IsBasketCheckOut);
            this.Model.set("isOrderCheckOut", vars._appData.IsBasketCheckOut === false);
            this.loadPayments();
        }

        protected createEvents(): void {
            this.TermsCondButtonClick = this.createClickEvent("orderpayment-view-terms-btn", this.termsCondButtonClick);
            this.CheckoutButtonClick = this.createClickEvent("orderpayment-checkout-btn", this.checkoutButtonClick);
            this.BackButtonClick = this.createClickEvent("orderpayment-back-btn", this.backButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyPayCardItems();
            this.destroyClickEvent("orderpayment-view-terms-btn", this.TermsCondButtonClick);
            this.destroyClickEvent("orderpayment-back-btn", this.BackButtonClick);
            this.destroyClickEvent("orderpayment-checkout-btn", this.CheckoutButtonClick);
        }

        private proxyPayCardClick;
        private payCardItems: JQuery;
        private createCardsItems() {
            let self = this;
            self.Model.set("orderId", vars._appData.OrderId);
            self.Model.set("isBasketCheckOut", vars._appData.IsBasketCheckOut);
            self.payCardItems = self.View.find('#orderpayment-view-info').find(".pay-card-item-row");
            if (self.payCardItems) {
                self.proxyPayCardClick = $.proxy(self.payCardClick, self);
                self.payCardItems.on('click', self.proxyPayCardClick);
            }
        }

        private destroyPayCardItems() {
            if (this.payCardItems) this.payCardItems.off('click', this.proxyPayCardClick);
        }

        private payCardClick(e: any): boolean {
            let self = this;
            let cur: JQuery = $(e.currentTarget);
            let id: number = cur.data('id');
            self.Model.set("payCardId", id);

            $('.pay-card-item-row').removeClass('card-delivery-item-row-selected');
            $("#pay-card-" + id).addClass('card-delivery-item-row-selected');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public BackButtonClick: { (e: any): void; };
        private backButtonClick(e) {
            if (vars._appData.PayOrderType === 1)
                vars._app.OpenController({ urlController: "account/orderinfo" });
            else
                vars._app.OpenController({ urlController: "account/orders" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }


        public CheckoutButtonClick: { (e: any): void; };
        private checkoutButtonClick(e) {
            let self = this;
            if (self.validate() == true) {
                self.BasketService.CreateOrder((responseData) => {
                    if (responseData.Result === 0) {
                        if (responseData.Data == "Ok") {
                            //$('.app-basket-counter').hide();
                            //vars._app.OpenController({ urlController: "basket/orderresult" });
                        }
                        else
                            M.toast({ html: responseData.Data });
                    }
                    else
                        vars._app.ShowError(responseData.Error);
                });
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public TermsCondButtonClick: { (e: any): void; };
        private termsCondButtonClick(e) {
            this.loadTermsConditions();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private validate(): boolean {
            let result: boolean = true;
            if (this.Model.get("payCardId") < 1) {
                M.toast({ html: vars._statres('label$select$paymethod') });
                result = false;
            }

            return result;
        }

        protected loadTermsConditions(): boolean {
            let self = this;
            vars._app.ShowLoading(true);

            let options: Interfaces.IControllerPageOptions = this.Options as Interfaces.IControllerPageOptions;
            self.CmsService.Page("/about/termsconditions", (responseData) => {
                if (responseData.Result === 0) {
                    let model: Interfaces.Model.IPage = responseData.Data;
                    self.View.find('#orderpayment-view-modal-content').html(model.Content);
                    if (!this.paymentViewModal)
                        this.paymentViewModal = $('#orderpayment-view-modal').modal();
                    this.paymentViewModal.modal('open');
                }
                else
                    vars._app.ShowError(responseData.Error);
                vars._app.HideLoading();
            });
            return true;
        }
        private paymentViewModal: JQuery;
    }
}

vars.registerController("account/orderpayment", function (module: any): Interfaces.IController { return new module.Controller.Account.OrderPayment(); });