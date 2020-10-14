define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            class Settings extends acc.Controller.Account.Account {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/account/settings.html", Id: "settings-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$settings")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            Account.Settings = Settings;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/settings", function (module) { return new module.Controller.Account.Settings(); });
});
//# sourceMappingURL=settings.js.map