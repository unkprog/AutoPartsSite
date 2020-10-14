define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/core/utils", "app/core/variables"], function (require, exports, vars, ctrl, utils, variables_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        class Main extends ctrl.Controller.BaseContent {
            constructor() {
                super();
                vars._main = this;
            }
            createOptions() {
                return { Url: "/app/controller/main.html", Id: "main-view" };
            }
            createModel() {
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
            }
            ControllersInit() {
                return vars._controllers;
            }
            GetContent() {
                return this.content;
            }
            ViewInit(view) {
                variables_1._app.SetControlNavigation(this);
                //this.Model.set("employee", vars._identity.employee);
                this.menu = $('<li><a id="app-btn-menu" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$menu") + '"><i class="material-icons">menu</i></a></li>'
                    + '<li><a id="app-btn-lang" class="dropdown-trigger tooltipped" data-target="app-dropdown-lang-menu" data-position="bottom" data-tooltip="' + vars._statres("label$language") + '"><img class="app-flag-icon" src="/img/flags/' + vars._app.getLocale() + '.svg"/></a></li>');
                this.sideNav = view.find('#main-view-slide');
                this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
                $("#app-navbar").find(".left").append(this.menu);
                this.sideNavBarRight = $("#app-navbar").find(".right");
                this.menuBasket = $('<li><a id="app-btn-basket" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$basket") + '"><i class="material-icons">shopping_cart</i></a></li>');
                this.sideNavBarRight.append(this.menuBasket);
                this.buttonMenu = this.menu.find("#app-btn-menu");
                this.content = view.find("#main-view-content");
                this.contentModal = view.find("#main-view-content-modal");
                super.ViewInit(view);
                this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
                this.initLogIn();
                variables_1._app.OpenController({ urlController: "search/index" });
                return false;
            }
            initLogIn() {
                this.menuRight = $('<li><a id="app-btn-login" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$account") + '"><i class="material-icons">person_outline</i></a></li>');
                this.sideNavBarRight.append(this.menuRight);
                this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, this);
            }
            LogIn() {
                this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
                if (vars._identity.Auth !== true)
                    return;
                this.userMenu = $('<li><a id="app-btn-user-menu" class="dropdown-trigger" data-target="app-dropdown-user-menu"><i class="material-icons">account_circle</i></a></li>');
                this.menuRight.find('#app-btn-login').remove();
                this.sideNavBarRight.append(this.userMenu);
                this.userMenu.find('.dropdown-trigger').dropdown({ constrainWidth: false });
                this.LogoutClick = utils.createClickEvent("app-user-logout", this.logoutClick, this);
            }
            LogOut() {
                vars._identity = { Auth: false, Token: '', User: null };
                //if (this.userMenu) {
                //    //this.userMenu.find('#app-btn-user-menu').dropdown('destroy');
                //    this.userMenu.remove();
                //}
                ////this.initLogIn();
            }
            ViewShow(e) {
                let result = super.ViewShow(e);
                this.menu.find('#app-btn-lang').dropdown({ constrainWidth: false });
                $("#app-navbar").find('.tooltipped').tooltip();
                return result;
            }
            ViewHide(e) {
                super.ViewHide(e);
                if (this.menu)
                    this.menu.remove();
            }
            createEvents() {
                this.OpenMenuButtonClick = this.createTouchClickEvent(this.buttonMenu, this.openMenuButtonClick);
                let self = this;
                this.AppTitleClick = utils.createClickEvent("app-title", this.appTitleClick, self);
                this.LangEnClick = this.createClickEvent("app-lang-en", this.langEnClick);
                this.LangRuClick = this.createClickEvent("app-lang-ru", this.langRuClick);
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
            }
            destroyEvents() {
                this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);
                this.destroyClickEvent("app-lang-en", this.LangEnClick);
                this.destroyClickEvent("app-lang-ru", this.LangRuClick);
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
            }
            openMenuButtonClick(e) {
                e.preventDefault();
                e.stopPropagation();
                this.sideNav.sidenav('open');
            }
            appTitleClick(e) {
                //this.initAfterLoaded();
            }
            loginClick(e) {
                if (vars._identity.Auth !== true) {
                    this.OpenController({ urlController: "account/login" });
                    e.preventDefault();
                    return false;
                }
            }
            logoutClick(e) {
                this.LogOut();
                location.reload();
                e.preventDefault();
                return false;
            }
            langEnClick(e) {
                vars._app.changeLocale("en");
                location.reload();
                e.preventDefault();
                return false;
            }
            langRuClick(e) {
                vars._app.changeLocale("ru");
                location.reload();
                e.preventDefault();
                return false;
            }
            menuSearchButtonClick(e) {
                return this.handleMenuItem(e, "search/index");
            }
            menuAboutButtonClick(e) {
                return this.handleMenuItem(e, "about/index");
            }
            menuNewsButtonClick(e) {
                return this.handleMenuItem(e, "news/index");
            }
            menuFaqButtonClick(e) {
                return this.handleMenuItem(e, "about/faq");
            }
            menuShippingButtonClick(e) {
                return this.handleMenuItem(e, "about/shipping");
            }
            menuPaymentButtonClick(e) {
                return this.handleMenuItem(e, "about/payment");
            }
            menuContactButtonClick(e) {
                return this.handleMenuItem(e, "about/contact");
            }
            userSettingsButtonClick(e) {
                return this.handleMenuItem(e, "account/settings");
            }
            userMessagesButtonClick(e) {
                return this.handleMenuItem(e, "account/messages");
            }
            userGarageButtonClick(e) {
                return this.handleMenuItem(e, "account/garage");
            }
            userOrdersButtonClick(e) {
                return this.handleMenuItem(e, "account/orders");
            }
            handleMenuItem(e, urlController) {
                this.sideNav.sidenav('close');
                if (!utils.isNullOrEmpty(urlController))
                    variables_1._app.OpenController({ urlController: urlController });
                e.preventDefault();
                return false;
            }
        }
        Controller.Main = Main;
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=main.js.map