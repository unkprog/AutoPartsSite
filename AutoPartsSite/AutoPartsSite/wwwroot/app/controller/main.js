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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/core/utils", "app/core/variables"], function (require, exports, vars, ctrl, utils, variables_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Main = /** @class */ (function (_super) {
            __extends(Main, _super);
            function Main() {
                var _this = _super.call(this) || this;
                vars._main = _this;
                return _this;
            }
            Main.prototype.createOptions = function () {
                return { Url: "/app/controller/main.html", Id: "main-view" };
            };
            Main.prototype.createModel = function () {
                return new kendo.data.ObservableObject({
                    "Header": vars._statres("label$AutoPartsSite"),
                    "client": { "name": "client@email.com", "phone": "+79991234567" },
                    "labelSearch": vars._statres("button$label$find"),
                    "labelAbout": vars._statres("label$aboutUs"),
                    "labelFaq": vars._statres("label$faq"),
                    "labelNews": vars._statres("label$news"),
                    "labelPayment": vars._statres("label$payment"),
                    "labelShipping": vars._statres("label$shipping"),
                    "labelContacts": vars._statres("label$contacts"),
                    "labelUserName": "",
                    "labelOrders": vars._statres("label$orders"),
                    "labelGarage": vars._statres("label$garage"),
                    "labelMessages": vars._statres("label$messages"),
                    "labelSettings": vars._statres("label$settings"),
                });
            };
            Main.prototype.ControllersInit = function () {
                return vars._controllers;
            };
            Main.prototype.GetContent = function () {
                return this.content;
            };
            Main.prototype.ViewInit = function (view) {
                variables_1._app.SetControlNavigation(this);
                //this.Model.set("employee", vars._identity.employee);
                this.menu = $('<li><a id="app-btn-menu" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$menu") + '"><i class="material-icons">menu</i></a></li>');
                this.sideNav = view.find('#main-view-slide');
                this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
                $("#app-navbar").find(".left").append(this.menu);
                this.sideNavBarRight = $("#app-navbar").find(".right");
                this.menuLang = $('<li><a id="app-btn-lang" class="dropdown-trigger tooltipped" data-target="app-dropdown-lang-menu" data-position="bottom" data-tooltip="' + vars._statres("label$language") + '"><img class="app-flag-icon" src="/img/flags/' + vars._app.getLocale() + '.svg"/></a></li>');
                this.menuBasket = $('<li><a id="app-btn-basket" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$basket") + '"><i class="material-icons">shopping_cart</i></a><div class="center app-basket-counter">0</div></li>');
                this.sideNavBarRight.append(this.menuLang).append(this.menuBasket);
                this.menuBasket.find('.app-basket-counter').hide();
                this.buttonMenu = this.menu.find("#app-btn-menu");
                this.content = view.find("#main-view-content");
                this.contentModal = view.find("#main-view-content-modal");
                _super.prototype.ViewInit.call(this, view);
                this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
                this.initLogIn();
                variables_1._app.OpenController({ urlController: "search/index" });
                return false;
            };
            Main.prototype.initLogIn = function () {
                this.menuRight = $('<li><a id="app-btn-login" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$account") + '"><i class="material-icons">person_outline</i></a></li>');
                this.sideNavBarRight.append(this.menuRight);
                this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, this);
            };
            Main.prototype.LogIn = function () {
                this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
                if (vars._identity.Auth !== true)
                    return;
                if (vars._identity.Cms === true) {
                    this.menuCms = $('<li><a id="main-view-btn-cms"><i class="material-icons">wysiwyg</i><span>CMS</span></a></li>');
                    $('#main-view-slide').append(this.menuCms);
                    this.CmsButtonClick = this.createClickEvent("main-view-btn-cms", this.cmsButtonClick);
                }
                this.userMenu = $('<li><a id="app-btn-user-menu" class="dropdown-trigger" data-target="app-dropdown-user-menu"><i class="material-icons">account_circle</i></a></li>');
                this.menuRight.find('#app-btn-login').remove();
                this.sideNavBarRight.append(this.userMenu);
                this.userMenu.find('.dropdown-trigger').dropdown({ constrainWidth: false });
                this.LogoutClick = utils.createClickEvent("app-user-logout", this.logoutClick, this);
            };
            Main.prototype.LogOut = function () {
                vars._identity = { Auth: false, Cms: false, Token: '', User: null };
                if (this.menuCms) {
                    this.destroyClickEvent("main-view-btn-cms", this.MenuContactButtonClick);
                    this.menuCms.remove();
                }
            };
            Main.prototype.ViewShow = function (e) {
                var result = _super.prototype.ViewShow.call(this, e);
                this.menuLang.find('#app-btn-lang').dropdown({ constrainWidth: false });
                $("#app-navbar").find('.tooltipped').tooltip();
                return result;
            };
            Main.prototype.ViewHide = function (e) {
                _super.prototype.ViewHide.call(this, e);
                if (this.menu)
                    this.menu.remove();
            };
            Main.prototype.createEvents = function () {
                this.OpenMenuButtonClick = this.createTouchClickEvent(this.buttonMenu, this.openMenuButtonClick);
                var self = this;
                this.AppTitleClick = utils.createClickEvent("app-title", this.appTitleClick, self);
                this.LangEnClick = this.createClickEvent("app-lang-en", this.langEnClick);
                this.LangRuClick = this.createClickEvent("app-lang-ru", this.langRuClick);
                this.BasketButtonClick = this.createClickEvent(this.menuBasket.find("#app-btn-basket"), this.basketButtonClick);
                //this.BasketButtonClick = utils.createClickEvent("app-btn-basket", this.basketButtonClick, this.View);
                this.MenuSearchButtonClick = this.createClickEvent("main-view-btn-search", this.menuSearchButtonClick);
                this.MenuAboutButtonClick = this.createClickEvent("main-view-btn-about", this.menuAboutButtonClick);
                this.MenuNewsButtonClick = this.createClickEvent("main-view-btn-news", this.menuNewsButtonClick);
                this.MenuFaqButtonClick = this.createClickEvent("main-view-btn-faq", this.menuFaqButtonClick);
                this.MenuPaymentButtonClick = this.createClickEvent("main-view-btn-payment", this.menuPaymentButtonClick);
                this.MenuShippingButtonClick = this.createClickEvent("main-view-btn-shipping", this.menuShippingButtonClick);
                this.MenuContactButtonClick = this.createClickEvent("main-view-btn-contact", this.menuContactButtonClick);
                this.UserOrdersButtonClick = this.createClickEvent("app-user-orders", this.userOrdersButtonClick);
                this.UserGarageButtonClick = this.createClickEvent("app-user-garage", this.userGarageButtonClick);
                this.UserMessagesButtonClick = this.createClickEvent("app-user-messages", this.userMessagesButtonClick);
                this.UserSettingsButtonClick = this.createClickEvent("app-user-settings", this.userSettingsButtonClick);
            };
            Main.prototype.destroyEvents = function () {
                this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);
                this.destroyClickEvent("app-lang-en", this.LangEnClick);
                this.destroyClickEvent("app-lang-ru", this.LangRuClick);
                //utils.destroyClickEvent("app-btn-basket", this.BasketButtonClick, this.View);
                this.destroyClickEvent(this.menuBasket.find("#app-btn-basket"), this.BasketButtonClick);
                this.destroyClickEvent("main-view-btn-contact", this.MenuContactButtonClick);
                this.destroyClickEvent("main-view-btn-shipping", this.MenuShippingButtonClick);
                this.destroyClickEvent("main-view-btn-payment", this.MenuPaymentButtonClick);
                this.destroyClickEvent("main-view-btn-faq", this.MenuFaqButtonClick);
                this.destroyClickEvent("main-view-btn-news", this.MenuNewsButtonClick);
                this.destroyClickEvent("main-view-btn-about", this.MenuAboutButtonClick);
                this.destroyClickEvent("main-view-btn-search", this.MenuSearchButtonClick);
                this.destroyClickEvent("app-user-settings", this.UserSettingsButtonClick);
                this.destroyClickEvent("app-user-messages", this.UserMessagesButtonClick);
                this.destroyClickEvent("app-user-garage", this.UserGarageButtonClick);
                this.destroyClickEvent("app-user-orders", this.UserOrdersButtonClick);
            };
            Main.prototype.openMenuButtonClick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.sideNav.sidenav('open');
            };
            Main.prototype.appTitleClick = function (e) {
                //this.initAfterLoaded();
            };
            Main.prototype.loginClick = function (e) {
                if (vars._identity.Auth !== true) {
                    this.OpenController({ urlController: "account/login" });
                    e.preventDefault();
                    return false;
                }
            };
            Main.prototype.logoutClick = function (e) {
                this.LogOut();
                location.reload();
                e.preventDefault();
                return false;
            };
            Main.prototype.langEnClick = function (e) {
                vars._app.changeLocale("en");
                location.reload();
                e.preventDefault();
                return false;
            };
            Main.prototype.langRuClick = function (e) {
                vars._app.changeLocale("ru");
                location.reload();
                e.preventDefault();
                return false;
            };
            Main.prototype.basketButtonClick = function (e) {
                return this.handleMenuItem(e, "basket/index");
            };
            Main.prototype.menuSearchButtonClick = function (e) {
                return this.handleMenuItem(e, "search/index");
            };
            Main.prototype.menuAboutButtonClick = function (e) {
                return this.handleMenuItem(e, "about/index");
            };
            Main.prototype.menuNewsButtonClick = function (e) {
                return this.handleMenuItem(e, "news/index");
            };
            Main.prototype.menuFaqButtonClick = function (e) {
                return this.handleMenuItem(e, "about/faq");
            };
            Main.prototype.menuShippingButtonClick = function (e) {
                return this.handleMenuItem(e, "about/shipping");
            };
            Main.prototype.menuPaymentButtonClick = function (e) {
                return this.handleMenuItem(e, "about/payment");
            };
            Main.prototype.menuContactButtonClick = function (e) {
                return this.handleMenuItem(e, "about/contact");
            };
            Main.prototype.cmsButtonClick = function (e) {
                return this.handleMenuItem(e, "cms/index");
            };
            Main.prototype.userSettingsButtonClick = function (e) {
                return this.handleMenuItem(e, "account/settings");
            };
            Main.prototype.userMessagesButtonClick = function (e) {
                return this.handleMenuItem(e, "account/messages");
            };
            Main.prototype.userGarageButtonClick = function (e) {
                return this.handleMenuItem(e, "account/garage");
            };
            Main.prototype.userOrdersButtonClick = function (e) {
                return this.handleMenuItem(e, "account/orders");
            };
            Main.prototype.handleMenuItem = function (e, urlController) {
                this.sideNav.sidenav('close');
                if (!utils.isNullOrEmpty(urlController))
                    variables_1._app.OpenController({ urlController: urlController });
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            return Main;
        }(ctrl.Controller.BaseContent));
        Controller.Main = Main;
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=main.js.map