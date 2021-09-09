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
                        "Header": vars._statres("label$messages"),
                        "labelEmptyMessages": vars._statres("label$messages$empty")
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
                    var _this = this;
                    var self = this;
                    vars._app.ShowLoading(false);
                    self.View.find('#messages-view-parts-empty').hide();
                    self.View.find('#messages-view-parts-rows').hide();
                    self.View.find('#messages-view-parts-rows').find('a').off('click', self.proxyOpenMessage);
                    self.AccountService.GetAskQuestions(function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#messages-view-parts-table-template').html();
                            var template = vars.getTemplate(templateContent);
                            var items = responseData.Data;
                            var htmlResult = '', icount = items.length;
                            if (icount < 1) {
                                self.View.find('#messages-view-parts-empty').show();
                            }
                            else {
                                for (var i = 0; i < icount; i++) {
                                    htmlResult = (htmlResult + template(items[i]));
                                }
                                self.View.find('#messages-view-parts-rows').show();
                            }
                            self.View.find('#messages-view-parts-rows').html(htmlResult);
                            if (htmlResult !== '') {
                                self.rebindModel();
                            }
                            self.View.find('#messages-view-parts-rows').find('a').on('click', self.proxyOpenMessage);
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