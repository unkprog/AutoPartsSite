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
            var Settings = /** @class */ (function (_super) {
                __extends(Settings, _super);
                function Settings() {
                    return _super.call(this) || this;
                }
                Settings.prototype.createOptions = function () {
                    return { Url: "/app/controller/account/settings.html", Id: "settings-view" };
                };
                Settings.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$settings"),
                        "labelShippingDestination": vars._statres("label$shipping$destination"),
                        "labelLanguage": vars._statres("label$language"),
                        "labelCurrency": vars._statres("label$currency"),
                        "labelSave": vars._statres("button$label$save"),
                        "labelCancel": vars._statres("button$label$cancel"),
                        "SettingsData": { "Countries": [], "Languages": [], "Currencies": [] },
                        "Settings": null
                    });
                };
                Settings.prototype.ViewShow = function (e) {
                    _super.prototype.ViewShow.call(this, e);
                    this.loadSettingsData();
                    return false;
                };
                Settings.prototype.createEvents = function () {
                    this.SaveButtonClick = this.createClickEvent("settings-view-btn-save", this.saveButtonClick);
                    //this.CancelButtonClick = this.createClickEvent("settings-view-btn-cancel", this.cancelButtonClick);
                };
                Settings.prototype.destroyEvents = function () {
                    this.destroyClickEvent("settings-view-btn-save", this.SaveButtonClick);
                    //this.destroyClickEvent("settings-view-btn-cancel", this.CancelButtonClick);
                };
                Settings.prototype.saveButtonClick = function (e) {
                    this.saveSettingsData();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                //public CancelButtonClick: { (e: any): void; };
                //private cancelButtonClick(e: any): boolean {
                //    vars._main.ControllerBack(this);
                //    e.preventDefault();
                //    e.stopPropagation();
                //    return false;
                //}
                Settings.prototype.loadSettingsData = function () {
                    var self = this;
                    vars._app.ShowLoading();
                    self.AccountService.SettingsData(vars._appData.Locale, vars._appData.Settings === null, function (responseData) {
                        if (responseData.Result === 0) {
                            self.Model.set("SettingsData", responseData.Data);
                            self.setupLists();
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                Settings.prototype.setupLists = function () {
                    var settingsData = this.Model.get("SettingsData");
                    var settings = vars._appData.Settings;
                    if (settings == null)
                        settings = settingsData.Current;
                    var html = '';
                    for (var i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                        html = html + '<option value="' + settingsData.Countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == settingsData.Countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                        html = html + settingsData.Countries[i].Code + ' - ' + settingsData.Countries[i].Name + '</option>';
                    }
                    $('#settings-view-list-country').html(html);
                    html = '';
                    for (var i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                        html = html + '<option value="' + settingsData.Languages[i].Id + '" ' + (settings.Language.Code.toLowerCase() == settingsData.Languages[i].Code.toLowerCase() ? 'selected' : '') + '>';
                        html = html + settingsData.Languages[i].Code + ' - ' + settingsData.Languages[i].Name + '</option>';
                    }
                    $('#settings-view-list-lang').html(html);
                    html = '';
                    for (var i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                        html = html + '<option value="' + settingsData.Currencies[i].Id + '" ' + (settings.Currency.Code.toLowerCase() == settingsData.Currencies[i].Code.toLowerCase() ? 'selected' : '') + '>';
                        html = html + settingsData.Currencies[i].Code + ' - ' + settingsData.Currencies[i].Name + '</option>';
                    }
                    $('#settings-view-list-currency').html(html);
                    this.View.find('select').formSelect();
                };
                Settings.prototype.saveSettingsData = function () {
                    var settingsData = this.Model.get("SettingsData");
                    var settings = vars._appData.Settings;
                    var country = parseInt($('#settings-view-list-country').val(), 0);
                    var lang = parseInt($('#settings-view-list-country').val(), 0);
                    var currency = parseInt($('#settings-view-list-country').val(), 0);
                    if (settings.Country.Id !== country) {
                        for (var i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                            if (settingsData.Countries[i].Id === country) {
                                settings.Country = settingsData.Countries[i];
                                break;
                            }
                        }
                    }
                    if (settings.Currency.Id !== currency) {
                        for (var i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                            if (settingsData.Currencies[i].Id === currency) {
                                settings.Currency = settingsData.Currencies[i];
                                break;
                            }
                        }
                    }
                    if (settings.Language.Id !== lang) {
                        for (var i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                            if (settingsData.Languages[i].Id === lang) {
                                settings.Language = settingsData.Languages[i];
                                break;
                            }
                        }
                    }
                    vars._appData.Settings = settings;
                    vars._app.OpenController({ urlController: "search/index" });
                };
                return Settings;
            }(acc.Controller.Account.Account));
            Account.Settings = Settings;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/settings", function (module) { return new module.Controller.Account.Settings(); });
});
//# sourceMappingURL=settings.js.map