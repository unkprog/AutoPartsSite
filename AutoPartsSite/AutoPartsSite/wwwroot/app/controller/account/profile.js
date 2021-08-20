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
            var Profile = (function (_super) {
                __extends(Profile, _super);
                function Profile() {
                    return _super.call(this) || this;
                }
                Profile.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/account/profile.html", Id: "profile-view", Page: "/account/profile" };
                    return options;
                };
                Profile.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$profile"),
                        "labelEmail": vars._statres("label$email"),
                        "labelPassword": vars._statres("label$password"),
                        "labelChange": vars._statres("label$password$change"),
                        "labelNewPassword": vars._statres("label$password$new"),
                        "Email": ""
                    });
                };
                Profile.prototype.OnViewInit = function () {
                    this.Model.set("Email", vars._appData.Identity.User.Email);
                };
                Profile.prototype.createEvents = function () {
                    var self = this;
                    self.ChangeButtonClick = self.createTouchClickEvent("profile-view-btn-change", self.changeButtonClick);
                    self.PassModalButtonClick = self.createTouchClickEvent("profile-view-btn-change-modal", self.passModalButtonClick);
                };
                Profile.prototype.destroyEvents = function () {
                    var self = this;
                    self.destroyTouchClickEvent("profile-view-btn-change-modal", self.PassModalButtonClick);
                    self.destroyTouchClickEvent("profile-view-btn-change", self.ChangeButtonClick);
                };
                Profile.prototype.changeButtonClick = function (e) {
                    var controller = this;
                    var model = {
                        Email: vars._appData.Identity.User.Email,
                        Pass: '',
                        Uid: vars._appData.Identity.Token,
                        ChangePass: $('#profile-view-new-pass').val(),
                    };
                    if (controller.validate(model)) {
                        controller.enterPassModal = controller.View.find('#profile-view-pass-modal').modal();
                        controller.enterPassModal.modal('open');
                    }
                };
                Profile.prototype.passModalButtonClick = function (e) {
                    var controller = this;
                    var model = {
                        Email: vars._appData.Identity.User.Email,
                        Pass: $('#profile-view-pass').val(),
                        Uid: vars._appData.Identity.Token,
                        ChangePass: $('#profile-view-new-pass').val(),
                    };
                    controller.AccountService.ChangePass(model, function (responseData) {
                        if (responseData.Result == 0)
                            vars._app.ShowMessage(vars._statres("label$password"), vars._statres("msg$success$Recovery"), function () {
                                $('#profile-view-login-pass').val('');
                            });
                        else
                            vars._app.ShowError(responseData.Error);
                    });
                };
                Profile.prototype.validate = function (model) {
                    var result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres('msg$error$emailIncorrect') });
                        result = false;
                    }
                    return result;
                };
                return Profile;
            }(acc.Controller.Account.Account));
            Account.Profile = Profile;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/profile", function (module) { return new module.Controller.Account.Profile(); });
});
//# sourceMappingURL=profile.js.map