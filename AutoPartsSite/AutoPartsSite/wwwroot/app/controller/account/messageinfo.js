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
                        "labelEmptyMessages": vars._statres("label$messages$empty")
                    });
                };
                MessageInfo.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    var self = this;
                    self.AccountService.GetAskQuestionInfo(vars._appData.MessageId, function (responseData) {
                        if (responseData.Result === 0) {
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                MessageInfo.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                };
                MessageInfo.prototype.destroyEvents = function () {
                    _super.prototype.destroyEvents.call(this);
                };
                return MessageInfo;
            }(acc.Controller.Account.Account));
            Account.MessageInfo = MessageInfo;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/messageinfo", function (module) { return new module.Controller.Account.MessageInfo(); });
});
//# sourceMappingURL=messageinfo.js.map