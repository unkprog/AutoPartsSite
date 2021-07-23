import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');
import utils = require('app/core/utils');

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
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/basket/delivery.html", Id: "delivery-view", Page: "/basket/delivery" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$address$delivery"),
                "labelBack": vars._statres("label$back"),
                "labelForward": vars._statres("label$forward"),

                "labelFullName": vars._statres("label$fullname"),
                "labelCountry": vars._statres("label$country"),
                "labelRegion": vars._statres("label$region"),
                "labelCity": vars._statres("label$city"),
                "labelZipCode": vars._statres("label$zipcode"),
                "labelStreet": vars._statres("label$address"),
                "labelPhoneCode": vars._statres("label$phonecode"),
                "labelPhone": vars._statres("label$phone"),
                "labelEmail": vars._statres("label$email"),

                "DeliveryAddress": {}
            });
        }

        public ViewInit(view: JQuery): boolean {
            super.ViewInit(view);
            return false;
        }

        protected OnViewInit(): void {
            let self = this;
            this.BasketService.DeliveryAddressData((responseData) => {
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
            let countries: Interfaces.Model.IReferenceNamedDbModel[] = responseData.Data.Countries;

            if (utils.isNullOrEmpty(responseData.Data.DeliveryAddress.Email))
                responseData.Data.DeliveryAddress.Email = vars._appData.Identity.User.Email;

            this.Model.set("DeliveryAddress", responseData.Data.DeliveryAddress);

            let html: string = '';
            for (let i = 0, icount = countries.length; i < icount; i++) {
                if (settings.Country.Id == countries[i].Id)
                    this.Model.set("DeliveryAddress.CountryId", countries[i].Id);
                html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Id == countries[i].Id ? 'selected' : '') + '>';
                html = html + /*countries[i].Code + ' - ' +*/ countries[i].Name + '</option>';
            }
            $('#delivery-view-country').html(html);
            this.View.find('select').formSelect();
            M.updateTextFields();
        }   
        
        protected createEvents(): void {
            this.CheckoutButtonClick = this.createClickEvent("delivery-checkout-btn", this.checkoutButtonClick);
            this.BackButtonClick = this.createClickEvent("delivery-back-btn", this.backButtonClick);

            
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("delivery-back-btn", this.BackButtonClick);
            this.destroyClickEvent("delivery-checkout-btn", this.CheckoutButtonClick);
        }

        public BackButtonClick: { (e: any): void; };
        private backButtonClick(e) {
            //vars._app.ControllerBack(e);
            vars._app.OpenController({ urlController: "basket/index" });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public CheckoutButtonClick: { (e: any): void; };
        private checkoutButtonClick(e) {
            let delivery: Interfaces.Model.IDeliveryAddressInfo = this.Model.get("DeliveryAddress").toJSON();
            if (this.validate(delivery)) {
                this.BasketService.SetDeliveryAddressData(delivery, (responseData) => {
                    if (responseData.Result === 0) {
                        vars._app.OpenController({ urlController: "basket/billing" });
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

        private validate(model: Interfaces.Model.IDeliveryAddressInfo): boolean {
            let result: boolean = true;
            
            if (utils.isNullOrEmpty(model.FullName)) {
                M.toast({ html: vars._statres('msg$error$notspecified$fullname') });
                result = false;
            }

            if (utils.isNull(model.CountryId) || model.CountryId == 0) {
                M.toast({ html: vars._statres('msg$error$notspecified$country') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Region)) {
                M.toast({ html: vars._statres('msg$error$notspecified$region') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.City)) {
                M.toast({ html: vars._statres('msg$error$notspecified$city') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.ZipCode)) {
                M.toast({ html: vars._statres('msg$error$notspecified$zipcode') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Street)) {
                M.toast({ html: vars._statres('msg$error$notspecified$street') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.PhoneCode)) {
                M.toast({ html: vars._statres('msg$error$notspecified$phonecode') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Phone)) {
                M.toast({ html: vars._statres('msg$error$notspecified$phone') });
                result = false;
            }

            if (!utils.validateEmail(model.Email)) {
                M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                result = false;
            }

            return result;
        }
    }
}

vars.registerController("basket/delivery", function (module: any): Interfaces.IController { return new module.Controller.Basket.Delivery(); });