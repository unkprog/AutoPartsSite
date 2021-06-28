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
            var Register = (function (_super) {
                __extends(Register, _super);
                function Register() {
                    return _super.call(this) || this;
                }
                Register.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/register.html", Id: "register-view", Page: "/account/register" };
                    return options;
                };
                Register.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("button$label$register"),
                        "labelEmail": vars._statres("label$email"),
                        "labelPassword": vars._statres("label$password"),
                        "labelConfirmPassword": vars._statres("label$confirmPassword"),
                        "labelRegister": vars._statres("button$label$register"),
                    });
                };
                Register.prototype.ViewShow = function (e) {
                    _super.prototype.ViewShow.call(this, e);
                    this.loadSettingsData();
                    return false;
                };
                Register.prototype.createEvents = function () {
                    this.RegisterButtonClick = this.createTouchClickEvent("btn-register", this.registerButtonClick);
                };
                Register.prototype.destroyEvents = function () {
                    this.destroyTouchClickEvent("btn-register", this.RegisterButtonClick);
                };
                Register.prototype.registerButtonClick = function (e) {
                    var controller = this;
                    var model = {
                        Email: $('#register-email').val()
                    };
                    if (this.validate(model)) {
                        controller.AccountService.Register(model, function (responseData) {
                            if (responseData.Result == 0)
                                vars._app.ShowMessage(vars._statres("button$label$register"), vars._statres("msg$success$Register"), function () {
                                    vars._app.OpenController({
                                        urlController: "account/login"
                                    });
                                });
                            else
                                vars._app.ShowError(responseData.Error);
                        });
                    }
                };
                Register.prototype.validate = function (model) {
                    var result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    return result;
                };
                Register.prototype.loadSettingsData = function () {
                    var self = this;
                    vars._app.ShowLoading(true);
                    self.AccountService.SettingsData(vars._appData.Locale.Id, vars._appData.Settings === null, function (responseData) {
                        if (responseData.Result === 0) {
                            self.setupLists(responseData.Data);
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                };
                Register.prototype.setupLists = function (responseData) {
                    var settingsData = responseData;
                    var countries = settingsData.Countries;
                    var settings = vars._appData.Settings;
                    if (settings == null)
                        settings = settingsData.Current;
                    var html = '';
                    for (var i = 0, icount = countries.length; i < icount; i++) {
                        html = html + '<option value="' + countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                        html = html + countries[i].Code + ' - ' + countries[i].Name + '</option>';
                    }
                    $('#register-view-country').html(html);
                    this.View.find('select').formSelect();
                };
                return Register;
            }(acc.Controller.Account.Account));
            Account.Register = Register;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/register", function (module) { return new module.Controller.Account.Register(); });
});
//# sourceMappingURL=register.js.map