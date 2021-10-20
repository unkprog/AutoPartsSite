var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/variables", "app/core/utils", "app/controller/account/account"], function (require, exports, vars, utils, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            var MessageInfo = (function (_super) {
                __extends(MessageInfo, _super);
                function MessageInfo() {
                    return _super.call(this) || this;
                }
                MessageInfo.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/messageinfo.html", Id: "messageinfo-view", Page: "/account/messageinfo" };
                    return options;
                };
                MessageInfo.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$messages"),
                        "labelClose": vars._statres("button$label$close"),
                        "labelReply": vars._statres("button$label$reply"),
                        "labelQuestion": vars._statres("label$messages$messagetext"),
                        "labelMessage": vars._statres("label$messages$message"),
                        "labelSend": vars._statres("label$send"),
                        "labelCancel": vars._statres("button$label$cancel"),
                        "AskQuestion": { Id: 0, ReplyId: 0,
                            Name: "",
                            Email: "",
                            Question: ""
                        },
                        "Message": {}
                    });
                };
                MessageInfo.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    this.loadMessages();
                };
                MessageInfo.prototype.loadMessages = function () {
                    var self = this;
                    self.Model.set("AskQuestion.ParentId", vars._appData.MessageId);
                    self.AccountService.AskQuestionInfo(vars._appData.MessageId, function (responseData) {
                        if (responseData.Result === 0) {
                            self.showMessageInfo(responseData.Data);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                MessageInfo.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                    var self = this;
                    self.proxyNewMessage = $.proxy(self.newMessage, self);
                    self.View.find('#messageinfo-view-btn-reply').on('click', self.proxyNewMessage);
                    self.CloseButtonClick = self.createTouchClickEvent("messageinfo-view-btn-close", self.closeButtonClick);
                    self.SendButtonClick = self.createTouchClickEvent("messageinfo-view-newask-btn", self.sendButtonClick);
                };
                MessageInfo.prototype.destroyEvents = function () {
                    var self = this;
                    self.View.find('#messageinfo-view-rows').find('.messageinfo-view-btn-reply').off('click', self.proxyNewMessage);
                    self.View.find('#messageinfo-view-btn-reply').off('click', self.proxyNewMessage);
                    self.destroyTouchClickEvent("messageinfo-view-btn-close", self.CloseButtonClick);
                    self.destroyTouchClickEvent("messageinfo-view-newask-btn", self.SendButtonClick);
                    _super.prototype.destroyEvents.call(this);
                };
                MessageInfo.prototype.closeButtonClick = function (e) {
                    vars._app.ControllerBack(e);
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                MessageInfo.prototype.showMessageInfo = function (data) {
                    var self = this;
                    self.View.find('#messageinfo-view-rows').find('.messageinfo-view-btn-reply').off('click', self.proxyNewMessage);
                    self.Model.set("Message", data);
                    var templateContent = self.View.find('#messageinfo-view-rows-template').html();
                    var template = vars.getTemplate(templateContent);
                    var items = data;
                    var htmlResult = '', icount = items.length;
                    for (var i = 0; i < icount; i++) {
                        htmlResult = (htmlResult + template(items[i]));
                    }
                    self.View.find('#messageinfo-view-rows').html(htmlResult);
                    if (htmlResult !== '') {
                        self.rebindModel();
                    }
                    self.View.find('#messageinfo-view-rows').find('.messageinfo-view-btn-reply').on('click', self.proxyNewMessage);
                    M.updateTextFields();
                };
                MessageInfo.prototype.newMessage = function (e) {
                    var self = this;
                    var replyId = $(e.currentTarget).data('id') | 0;
                    self.Model.set("AskQuestion.ReplyId", replyId);
                    self.Model.set("Question", "");
                    self.View.find('#messageinfo-view-newask-question').characterCounter();
                    if (!self.messageInfoViewNewAskInfo)
                        self.messageInfoViewNewAskInfo = self.View.find('#messageinfo-view-newask-modal').modal();
                    M.updateTextFields();
                    this.messageInfoViewNewAskInfo.modal('open');
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                MessageInfo.prototype.sendButtonClick = function (e) {
                    var self = this;
                    if (vars._appData.Identity && vars._appData.Identity.User && vars._appData.Identity.User.Email && !utils.isNullOrEmpty(vars._appData.Identity.User.Email))
                        self.Model.set("AskQuestion.Email", vars._appData.Identity.User.Email);
                    var question = self.Model.get("AskQuestion").toJSON();
                    if (this.validateMessage(question)) {
                        this.AccountService.SendAskQuestion(question, function (responseData) {
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
                };
                MessageInfo.prototype.validateMessage = function (model) {
                    var result = true;
                    if (utils.isNullOrEmpty(model.Question)) {
                        M.toast({ html: vars._statres("label$ask$question$incorrect") });
                        result = false;
                    }
                    return result;
                };
                return MessageInfo;
            }(acc.Controller.Account.Account));
            Account.MessageInfo = MessageInfo;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/messageinfo", function (module) { return new module.Controller.Account.MessageInfo(); });
});
//# sourceMappingURL=messageinfo.js.map