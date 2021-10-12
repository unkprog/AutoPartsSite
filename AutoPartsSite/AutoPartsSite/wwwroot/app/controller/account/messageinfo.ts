import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class MessageInfo extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/account/messageinfo.html", Id: "messageinfo-view", Page: "/account/messageinfo" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$messages"),
                "labelEmptyMessages": vars._statres("label$messages$empty")
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            let self = this;

            self.AccountService.GetAskQuestionInfo(vars._appData.MessageId, (responseData) => {
                if (responseData.Result === 0) {
                    //self.showOrderInfo(responseData.Data);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        protected createEvents(): void {
            super.createEvents();
        }

        protected destroyEvents(): void {
            super.destroyEvents();
        }

 
    }
}

vars.registerController("account/messageinfo", function (module: any): Interfaces.IController { return new module.Controller.Account.MessageInfo(); });