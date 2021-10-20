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
                "labelReply": vars._statres("button$label$reply"),
                "labelQuestion": vars._statres("label$messages$messagetext"),
                "labelMessage": vars._statres("label$messages$message"),
                "labelSend": vars._statres("label$send"),
                "labelCancel": vars._statres("button$label$cancel"),
                "AskQuestion": { Id : 0, ReplyId: 0,
                    Name: "",
                    Email: "",
                    Question: ""
                },
                "Message": {}
            });
        }

        protected OnViewInit(): void {
            super.OnViewInit();
            this.loadMessages();
        }

        private loadMessages() {
            let self = this;
            self.Model.set("AskQuestion.ParentId", vars._appData.MessageId);
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

        private proxyNewMessage;
        protected createEvents(): void {
            super.createEvents();
            let self = this;
            self.proxyNewMessage = $.proxy(self.newMessage, self);
            self.View.find('#messageinfo-view-btn-reply').on('click', self.proxyNewMessage);
            self.CloseButtonClick = self.createTouchClickEvent("messageinfo-view-btn-close", self.closeButtonClick);
            self.SendButtonClick = self.createTouchClickEvent("messageinfo-view-newask-btn", self.sendButtonClick);
            
        }

        protected destroyEvents(): void {
            let self = this;
            self.View.find('#messageinfo-view-rows').find('.messageinfo-view-btn-reply').off('click', self.proxyNewMessage);
            self.View.find('#messageinfo-view-btn-reply').off('click', self.proxyNewMessage);
            self.destroyTouchClickEvent("messageinfo-view-btn-close", self.CloseButtonClick);
            self.destroyTouchClickEvent("messageinfo-view-newask-btn", self.SendButtonClick);
            super.destroyEvents();
        }

        public CloseButtonClick: { (e: any): void; };
        private closeButtonClick(e) {
            vars._app.ControllerBack(e);
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }

        private showMessageInfo(data: any): void {
            let self = this;

            self.View.find('#messageinfo-view-rows').find('.messageinfo-view-btn-reply').off('click', self.proxyNewMessage);

            self.Model.set("Message", data);

            let templateContent = self.View.find('#messageinfo-view-rows-template').html();
            
            let template = vars.getTemplate(templateContent);
            
            let items: any[] = data;
            let htmlResult = '', icount = items.length;
            for (let i = 0; i < icount; i++) {
                htmlResult = (htmlResult + template(items[i]));
            }

            self.View.find('#messageinfo-view-rows').html(htmlResult);
            
            if (htmlResult !== '') {
                self.rebindModel();
            }
            self.View.find('#messageinfo-view-rows').find('.messageinfo-view-btn-reply').on('click', self.proxyNewMessage);

            M.updateTextFields();
        }

        private messageInfoViewNewAskInfo;
        private newMessage(e: any): boolean {
            let self = this;
            let replyId: number = $(e.currentTarget).data('id') | 0;
            self.Model.set("AskQuestion.ReplyId", replyId);
            self.Model.set("Question", "");
            self.View.find('#messageinfo-view-newask-question').characterCounter();

            if (!self.messageInfoViewNewAskInfo)
                self.messageInfoViewNewAskInfo = self.View.find('#messageinfo-view-newask-modal').modal();
            M.updateTextFields();
            this.messageInfoViewNewAskInfo.modal('open')
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }

        public SendButtonClick: { (e: any): void; };
        private sendButtonClick(e) {
            let self = this;
           
            if (vars._appData.Identity && vars._appData.Identity.User && vars._appData.Identity.User.Email && !utils.isNullOrEmpty(vars._appData.Identity.User.Email))
                self.Model.set("AskQuestion.Email", vars._appData.Identity.User.Email);

            let question: Interfaces.Model.IAskQuestion = self.Model.get("AskQuestion").toJSON();

            if (this.validateMessage(question)) {
                this.AccountService.SendAskQuestion(question, (responseData) => {
                    if (responseData.Result === 0) {
                        self.messageInfoViewNewAskInfo.modal('close');
                        M.toast({ html: vars._statres("message$ask$question$sent") });
                        self.loadMessages();
                    }
                    else {
                        vars._app.ShowError(responseData.Error);
                    }
                    vars._app.HideLoading();
                });
            }

            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            return false;
        }

        private validateMessage(model: Interfaces.Model.IAskQuestion): boolean {
            let result: boolean = true;

            if (utils.isNullOrEmpty(model.Question)) {
                M.toast({ html: vars._statres("label$ask$question$incorrect") });
                result = false;
            }

            return result;
        }
    }
}

vars.registerController("account/messageinfo", function (module: any): Interfaces.IController { return new module.Controller.Account.MessageInfo(); });