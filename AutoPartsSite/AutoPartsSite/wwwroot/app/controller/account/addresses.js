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
            var Addresses = (function (_super) {
                __extends(Addresses, _super);
                function Addresses() {
                    return _super.call(this) || this;
                }
                Addresses.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/addresses.html", Id: "addresses-view", Page: "/account/addresses" };
                    return options;
                };
                Addresses.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$addresses"),
                        "labelEmptyAddresses": vars._statres("label$addresses$empty"),
                        "labelBilling": vars._statres("label$address$billing"),
                        "labelDelivery": vars._statres("label$address$delivery"),
                        "labelFullName": vars._statres("label$fullname"),
                        "labelCountry": vars._statres("label$country"),
                        "labelRegion": vars._statres("label$region"),
                        "labelCity": vars._statres("label$city"),
                        "labelZipCode": vars._statres("label$zipcode"),
                        "labelStreet": vars._statres("label$address"),
                        "labelPhoneCode": vars._statres("label$phonecode"),
                        "labelPhone": vars._statres("label$phone"),
                        "labelEmail": vars._statres("label$email"),
                    });
                };
                Addresses.prototype.OnViewInit = function () {
                    _super.prototype.OnViewInit.call(this);
                    this.search(undefined);
                };
                Addresses.prototype.createEvents = function () {
                    _super.prototype.createEvents.call(this);
                    this.proxyOpenMessage = $.proxy(this.openAddress, this);
                };
                Addresses.prototype.destroyEvents = function () {
                    this.View.find('#orders-view-parts-table-rows').find('.message-view-item').off('click', this.proxyOpenMessage);
                    _super.prototype.destroyEvents.call(this);
                };
                Addresses.prototype.search = function (e) {
                    var _this = this;
                    var self = this;
                    vars._app.ShowLoading(false);
                    self.View.find('#addresses-view-parts-empty').hide();
                    self.View.find('#addresses-view-parts-rows').hide();
                    self.View.find('#addresses-view-parts-rows').find('.message-view-item').off('click', self.proxyOpenMessage);
                    self.AccountService.GetAddresses(function (responseData) {
                        if (responseData.Result === 0) {
                            var templateContent = _this.View.find('#addresses-view-parts-table-template').html();
                            var template = vars.getTemplate(templateContent);
                            var items = responseData.Data;
                            var htmlResult = '', icount = items.length;
                            if (icount < 1) {
                                self.View.find('#addresses-view-parts-empty').show();
                            }
                            else {
                                for (var i = 0; i < icount; i++) {
                                    htmlResult = (htmlResult + template(items[i]));
                                }
                                self.View.find('#addresses-view-parts-rows').show();
                            }
                            self.View.find('#addresses-view-parts-rows').html(htmlResult);
                            if (htmlResult !== '') {
                                self.rebindModel();
                            }
                            self.View.find('#addresses-view-parts-rows').find('.message-view-item').on('click', self.proxyOpenMessage);
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
                Addresses.prototype.openAddress = function (e) {
                    var id = $(e.currentTarget).data('id');
                    vars._appData.AddressId = id;
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    return false;
                };
                return Addresses;
            }(acc.Controller.Account.Account));
            Account.Addresses = Addresses;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/addresses", function (module) { return new module.Controller.Account.Addresses(); });
});
//# sourceMappingURL=addresses.js.map