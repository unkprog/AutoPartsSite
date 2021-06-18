import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import bsk = require('app/services/basketservice');
import utils = require('app/core/utils');

export namespace Controller.Search {
    export class AskQuestion extends base.Controller.Base {

        constructor() {
            super();
            this.basketService = new bsk.Services.BasketService();
        }

        private basketService: bsk.Services.BasketService;
        public get BasketService(): bsk.Services.BasketService {
            return this.basketService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/search/askquestion.html", Id: "askquestion-view", Page: "/search/askquestion" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$ask$question"),
                "AskQuestion": {
                    Name: "",
                    Email: "",
                    Question: ""
                },
                "labelName": vars._statres("label$ask$name"),
                "labelEmail": vars._statres("label$email"),
                "labelQuestion": vars._statres("label$howcan$help"),
                "labelSend": vars._statres("label$send"),
            });
        }

        public ViewInit(view: JQuery): boolean {
            return super.ViewInit(view);
        }

        protected OnViewInit(): void {
            ////vars._app.ShowLoading(true);
            //let self = this;

            //this.BasketService.DeliveryAddressData((responseData) => {

            //    if (responseData.Result === 0) {
            //        self.setupDeliveryData(responseData);
            //    }
            //    else {
            //        vars._app.ShowError(responseData.Error);
            //    }
            //    vars._app.HideLoading();
            //});
        }

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            let self = this;
            M.updateTextFields();
            M.textareaAutoResize(self.View.find('#askquestion-view-question'));
            return result;
        }

        //private setupDeliveryData(responseData) {
        //    let settings: Interfaces.Model.ISettings = vars._appData.Settings;
        //    let countries: Interfaces.Model.IReferenceNamedDbModel[] = responseData.Data.Countries;

        //    this.Model.set("DeliveryAddress", responseData.Data.DeliveryAddress);

        //    let html: string = '';
        //    for (let i = 0, icount = countries.length; i < icount; i++) {
        //        if (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase())
        //            this.Model.set("DeliveryAddress.CountryId", countries[i].Id);
        //        html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
        //        html = html + countries[i].Code + ' - ' + countries[i].Name + '</option>';
        //    }
        //    $('#delivery-view-country').html(html);
        //    this.View.find('select').formSelect();
        //    M.updateTextFields();
        //}   
        
        protected createEvents(): void {
            this.SendButtonClick = this.createClickEvent("askquestion-send-btn", this.sendButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("askquestion-send-btn", this.SendButtonClick);
        }

        public SendButtonClick: { (e: any): void; };
        private sendButtonClick(e) {
            let question: Interfaces.Model.IAskQuestion = this.Model.get("AskQuestion").toJSON();
            if (this.validate(question)) {
                //this.BasketService.SetDeliveryAddressData(delivery, (responseData) => {
                //    if (responseData.Result === 0) {
                //        vars._app.OpenController({ urlController: "basket/billing" });
                //    }
                //    else {
                //        vars._app.ShowError(responseData.Error);
                //    }
                //    vars._app.HideLoading();
                //});
            }
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private validate(model: Interfaces.Model.IAskQuestion): boolean {
            let result: boolean = true;
            
            if (utils.isNullOrEmpty(model.Name)) {
                M.toast({ html: vars._statres('msg$error$notspecified$fullname') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Email)) {
                M.toast({ html: vars._statres('msg$error$notspecified$fullname') });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Question)) {
                M.toast({ html: vars._statres('msg$error$notspecified$fullname') });
                result = false;
            }

            return result;
        }
    }
}

vars.registerController("search/askquestion", function (module: any): Interfaces.IController { return new module.Controller.Search.AskQuestion(); });