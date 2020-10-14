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
                this.menu = $('<li><a id="app-btn-menu"><i class="material-icons">menu</i></a></li><li><a id="app-btn-lang" class="dropdown-trigger" data-target="app-dropdown-lang-menu"><img class="app-flag-icon" src="/img/flags/' + vars._app.getLocale() + '.svg"/></a></li>');
                this.sideNav = view.find('#main-view-slide');
                this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
                $("#app-navbar").find(".left").append(this.menu);
                this.sideNavBarRight = $("#app-navbar").find(".right");
                this.buttonMenu = this.menu.find("#app-btn-menu");
                this.content = view.find("#main-view-content");
                this.contentModal = view.find("#main-view-content-modal");
                super.ViewInit(view);
                this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
                this.initLogIn();
                this.navigateOnStart();
                return false;
            }
            initLogIn() {
                this.menuRight = $('<li><a id="app-btn-login"><i class="material-icons">person_outline</i></a></li>');
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
            }
            navigateOnStart() {
                this.handleMenuItem("search/index");
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
                this.handleMenuItem("search/index");
                e.preventDefault();
                return false;
            }
            menuAboutButtonClick(e) {
                this.handleMenuItem("about/index");
                e.preventDefault();
                return false;
            }
            menuNewsButtonClick(e) {
                this.handleMenuItem("news/index");
                e.preventDefault();
                return false;
            }
            menuFaqButtonClick(e) {
                this.handleMenuItem("about/faq");
                e.preventDefault();
                return false;
            }
            menuShippingButtonClick(e) {
                this.handleMenuItem("about/shipping");
                e.preventDefault();
                return false;
            }
            menuPaymentButtonClick(e) {
                this.handleMenuItem("about/payment");
                e.preventDefault();
                return false;
            }
            menuContactButtonClick(e) {
                this.handleMenuItem("about/contact");
                e.preventDefault();
                return false;
            }
            handleMenuItem(urlController) {
                this.sideNav.sidenav('close');
                if (!utils.isNullOrEmpty(urlController))
                    variables_1._app.OpenController({ urlController: urlController });
            }
        }
        Controller.Main = Main;
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=main.js.map