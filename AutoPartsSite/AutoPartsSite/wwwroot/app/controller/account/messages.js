define(["require", "exports", "app/core/variables", "app/controller/account/account"], function (require, exports, vars, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Account;
        (function (Account) {
            class Messages extends acc.Controller.Account.Account {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/account/messages.html", Id: "messages-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$messages")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            Account.Messages = Messages;
        })(Account = Controller.Account || (Controller.Account = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("account/messages", function (module) { return new module.Controller.Account.Messages(); });
});
//# sourceMappingURL=messages.js.map