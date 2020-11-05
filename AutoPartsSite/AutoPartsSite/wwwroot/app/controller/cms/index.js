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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/core/utils"], function (require, exports, vars, base, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms) {
            var Index = /** @class */ (function (_super) {
                __extends(Index, _super);
                function Index() {
                    return _super.call(this) || this;
                }
                Index.prototype.createOptions = function () {
                    return { Url: "/app/controller/cms/index.html", Id: "cms-view" };
                };
                Index.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": "CMS",
                        "labelPages": vars._statres("label$site$pages"),
                        "labelAbout": vars._statres("label$aboutUs"),
                        "labelPayment": vars._statres("label$payment"),
                        "labelShipping": vars._statres("label$shipping"),
                        "labelContacts": vars._statres("label$contacts"),
                        "labelNewsFaq": vars._statres("label$news") + ', ' + vars._statres("label$faq"),
                        "labelNews": vars._statres("label$news"),
                        "labelFaq": vars._statres("label$faq")
                    });
                };
                Index.prototype.createEvents = function () {
                    this.AboutButtonClick = this.createClickEvent("cms-view-btn-about", this.aboutButtonClick);
                    this.PaymentButtonClick = this.createClickEvent("cms-view-btn-payment", this.paymentButtonClick);
                    this.ShippingButtonClick = this.createClickEvent("cms-view-btn-shipping", this.shippingButtonClick);
                    this.ContactsButtonClick = this.createClickEvent("cms-view-btn-contacts", this.contactsButtonClick);
                    this.NewsButtonClick = this.createClickEvent("cms-view-btn-news", this.newsButtonClick);
                    this.FaqButtonClick = this.createClickEvent("cms-view-btn-faq", this.faqButtonClick);
                };
                Index.prototype.destroyEvents = function () {
                    this.destroyClickEvent("cms-view-btn-faq", this.FaqButtonClick);
                    this.destroyClickEvent("cms-view-btn-news", this.NewsButtonClick);
                    this.destroyClickEvent("cms-view-btn-contacts", this.ContactsButtonClick);
                    this.destroyClickEvent("cms-view-btn-shipping", this.ShippingButtonClick);
                    this.destroyClickEvent("cms-view-btn-payment", this.PaymentButtonClick);
                    this.destroyClickEvent("cms-view-btn-about", this.AboutButtonClick);
                };
                Index.prototype.aboutButtonClick = function (e) {
                    return this.handleButtonItemPage(e, 'cms/editor/page', "/about/index", "label$aboutUs");
                };
                Index.prototype.paymentButtonClick = function (e) {
                    return this.handleButtonItemPage(e, 'cms/editor/page', "/about/payment", "label$payment");
                };
                Index.prototype.shippingButtonClick = function (e) {
                    return this.handleButtonItemPage(e, 'cms/editor/page', "/about/shipping", "label$shipping");
                };
                Index.prototype.contactsButtonClick = function (e) {
                    return this.handleButtonItemPage(e, 'cms/editor/page', "/about/contact", "label$contacts");
                };
                Index.prototype.faqButtonClick = function (e) {
                    return this.handleButtonItemPage(e, 'cms/editor/page', "/about/faq", "label$faq");
                };
                Index.prototype.newsButtonClick = function (e) {
                    return this.handleButtonItem(e, 'cms/card/new');
                };
                Index.prototype.handleButtonItemPage = function (e, urlController, pageEditItem, pageEditItemHeader) {
                    vars._appData.PageEditItem = pageEditItem;
                    vars._appData.PageEditItemHeader = pageEditItemHeader;
                    return this.handleButtonItem(e, urlController);
                };
                Index.prototype.handleButtonItem = function (e, urlController) {
                    if (!utils.isNullOrEmpty(urlController))
                        vars._app.OpenController({ urlController: urlController, backController: this });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                return Index;
            }(base.Controller.Base));
            Cms.Index = Index;
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("cms/index", function (module) { return new module.Controller.Cms.Index(); });
});
//# sourceMappingURL=index.js.map