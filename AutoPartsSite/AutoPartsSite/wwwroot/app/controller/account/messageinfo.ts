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
                "labelClose": vars._statres("button$label$close"),
                "Message": {}
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            let self = this;

            self.AccountService.AskQuestionInfo(vars._appData.MessageId, (responseData) => {
                if (responseData.Result === 0) {
                    self.showMessageInfo(responseData.Data);
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        protected createEvents(): void {
            super.createEvents();
            let self = this;
            self.CloseButtonClick = self.createTouchClickEvent("messageinfo-view-btn-close", self.closeButtonClick);
        }

        protected destroyEvents(): void {
            let self = this;
            self.destroyTouchClickEvent("messageinfo-view-btn-close", self.CloseButtonClick);
            super.destroyEvents();
        }

        public CloseButtonClick: { (e: any): void; };
        private closeButtonClick(e) {
            vars._app.ControllerBack(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private showMessageInfo(data: any): void {
            let self = this;
            self.Model.set("Message", data);

            let templateContent = self.View.find('#messageinfo-view-rows-template').html();
            
            let template = vars.getTemplate(templateContent);
            
            let items: any[] = data;
            let htmlResult = '', icount = items.length;
            let totalSum = 0.0;
            for (let i = 0; i < icount; i++) {
                htmlResult = (htmlResult + template(items[i]));
            }

            self.View.find('#messageinfo-view-rows').html(htmlResult);
            
            if (htmlResult !== '') {
                self.rebindModel();
            }


            M.updateTextFields();
        }
    }
}

vars.registerController("account/messageinfo", function (module: any): Interfaces.IController { return new module.Controller.Account.MessageInfo(); });