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
define(["require", "exports", "app/core/variables", "app/controller/about/aboutview"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            var Contact = (function (_super) {
                __extends(Contact, _super);
                function Contact() {
                    return _super.call(this) || this;
                }
                Contact.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$contacts"),
                        "labelAskQuestion": vars._statres("label$ask$question"),
                    });
                };
                Contact.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/about/contact.html", Id: "contact-view", Page: "/about/contact" };
                    return options;
                };
                Contact.prototype.createEvents = function () {
                    this.AskButtonClick = this.createTouchClickEvent("contact-view-askq-btn", this.askButtonClick);
                };
                Contact.prototype.destroyEvents = function () {
                    this.destroyTouchClickEvent("contact-view-askq-btn", this.AskButtonClick);
                };
                Contact.prototype.askButtonClick = function (e) {
                    vars._main.OpenRequest();
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                return Contact;
            }(base.Controller.About.AboutView));
            About.Contact = Contact;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("about/contact", function (module) { return new module.Controller.About.Contact(); });
});
//# sourceMappingURL=contact.js.map