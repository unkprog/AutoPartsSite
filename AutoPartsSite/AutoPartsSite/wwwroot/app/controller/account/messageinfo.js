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
define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
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
                        "Message": {}
                    });
                };
                MessageInfo.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    var self = this;
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
                    self.CloseButtonClick = self.createTouchClickEvent("messageinfo-view-btn-close", self.closeButtonClick);
                };
                MessageInfo.prototype.destroyEvents = function () {
                    var self = this;
                    self.destroyTouchClickEvent("messageinfo-view-btn-close", self.CloseButtonClick);
                    _super.prototype.destroyEvents.call(this);
                };
                MessageInfo.prototype.closeButtonClick = function (e) {
                    vars._app.ControllerBack(e);
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                MessageInfo.prototype.showMessageInfo = function (data) {
                    var self = this;
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
                    M.updateTextFields();
                };
                return MessageInfo;
            }(acc.Controller.Account.Account));
            Account.MessageInfo = MessageInfo;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/messageinfo", function (module) { return new module.Controller.Account.MessageInfo(); });
});
//# sourceMappingURL=messageinfo.js.map