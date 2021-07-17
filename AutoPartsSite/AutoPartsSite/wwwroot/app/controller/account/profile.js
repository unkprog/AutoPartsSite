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
                        "Header": vars._statres("label$profile")
                    });
                };
                Profile.prototype.createEvents = function () {
                };
                Profile.prototype.destroyEvents = function () {
                };
                return Profile;
            }(acc.Controller.Account.Account));
            Account.Profile = Profile;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/profile", function (module) { return new module.Controller.Account.Profile(); });
});
//# sourceMappingURL=profile.js.map