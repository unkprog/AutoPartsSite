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
            var Messages = (function (_super) {
                __extends(Messages, _super);
                function Messages() {
                    return _super.call(this) || this;
                }
                Messages.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/messages.html", Id: "messages-view", Page: "/account/messages" };
                    return options;
                };
                Messages.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$messages")
                    });
                };
                Messages.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    this.search(undefined);
                };
                Messages.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                    this.proxyOpenMessage = $.proxy(this.openMessage, this);
                };
                Messages.prototype.destroyEvents = function () {
                    this.View.find('#orders-view-parts-table-rows').find('a').off('click', this.proxyOpenMessage);
                    _super.prototype.destroyEvents.call(this);
                };
                Messages.prototype.search = function (e) {
                    var self = this;
                    vars._app.ShowLoading(false);
                    self.AccountService.GetAskQuestions(function (responseData) {
                        if (responseData.Result === 0) {
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                Messages.prototype.openMessage = function (e) {
                    var id = $(e.currentTarget).data('id');
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                return Messages;
            }(acc.Controller.Account.Account));
            Account.Messages = Messages;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/messages", function (module) { return new module.Controller.Account.Messages(); });
});
//# sourceMappingURL=messages.js.map