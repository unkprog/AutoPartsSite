import vars = require('app/core/variables');
import ctrl = require('app/core/basecontroller');
import utils = require('app/core/utils');
import { _app, _main } from 'app/core/variables';

export namespace Controller {
    export class Main extends ctrl.Controller.BaseContent implements Interfaces.IMainNavigation {

        constructor() {
            super();
            vars._main = this;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/main.html", Id: "main-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
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

        protected ControllersInit(): any {
            return vars._controllers;
        }

        private content: JQuery;
        private contentModal: JQuery;
        protected GetContent(): JQuery {
            return this.content;
        }

        private menu: JQuery;
        private menuRight: JQuery;
        private menuLang: JQuery;
        private menuBasket: JQuery;
        private sideNav: JQuery;
        private sideNavBarRight: JQuery;
        private buttonMenu: JQuery;
        private userMenu: JQuery;

        public ViewInit(view: JQuery): boolean {
            _app.SetControlNavigation(this);
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
            super.ViewInit(view);

            this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
            this.initLogIn();

            _app.OpenController({ urlController: "search/index" });
            return false;
        }

        private initLogIn() {
            this.menuRight = $('<li><a id="app-btn-login" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$account") + '"><i class="material-icons">person_outline</i></a></li>');
            this.sideNavBarRight.append(this.menuRight);
            this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, this);
        }

        public LogIn(): void {
          
            this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
            if (vars._identity.Auth !== true)
                return;

            this.userMenu = $('<li><a id="app-btn-user-menu" class="dropdown-trigger" data-target="app-dropdown-user-menu"><i class="material-icons">account_circle</i></a></li>');
            this.menuRight.find('#app-btn-login').remove();
            this.sideNavBarRight.append(this.userMenu);

            this.userMenu.find('.dropdown-trigger').dropdown({ constrainWidth: false });
            this.LogoutClick = utils.createClickEvent("app-user-logout", this.logoutClick, this);

        }

        public LogOut(): void {
            vars._identity = { Auth: false, Token: '', User: null };
            //if (this.userMenu) {
            //    //this.userMenu.find('#app-btn-user-menu').dropdown('destroy');
            //    this.userMenu.remove();
            //}
            ////this.initLogIn();
        }
        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            this.menuLang.find('#app-btn-lang').dropdown({ constrainWidth: false });
            $("#app-navbar").find('.tooltipped').tooltip();
            return result;
        }

        public ViewHide(e) {
            super.ViewHide(e);
            if (this.menu)
                this.menu.remove();
        }

        protected createEvents(): void {
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

        protected destroyEvents(): void {
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

        public OpenMenuButtonClick: { (e: any): void; };
        private openMenuButtonClick(e) {
            e.preventDefault();
            e.stopPropagation();
            this.sideNav.sidenav('open');
        }

        public AppTitleClick: { (e: any): void; };
        private appTitleClick(e) {
            //this.initAfterLoaded();
        }

        public LoginClick: { (e: any): void; };
        private loginClick(e) {
            if (vars._identity.Auth !== true) {
                this.OpenController({ urlController: "account/login" });
                e.preventDefault();
                return false;
            }
        }

        public LogoutClick: { (e: any): void; };
        private logoutClick(e) {
            this.LogOut();
            location.reload();
            e.preventDefault();
            return false;
        }

        public LangEnClick: { (e: any): void; };
        private langEnClick(e) {
            vars._app.changeLocale("en");
            location.reload();
            e.preventDefault();
            return false;
        }

        public LangRuClick: { (e: any): void; };
        private langRuClick(e) {
            vars._app.changeLocale("ru");
            location.reload();
            e.preventDefault();
            return false;
        }

        public MenuSearchButtonClick: { (e: any): void; };
        private menuSearchButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "search/index");
        }

        public MenuAboutButtonClick: { (e: any): void; };
        private menuAboutButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "about/index");
        }

        public MenuNewsButtonClick: { (e: any): void; };
        private menuNewsButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "news/index");
        }

        public MenuFaqButtonClick: { (e: any): void; };
        private menuFaqButtonClick(e: any): boolean {
            return this.handleMenuItem(e,"about/faq");
        }

        public MenuShippingButtonClick: { (e: any): void; };
        private menuShippingButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "about/shipping");
        }

        public MenuPaymentButtonClick: { (e: any): void; };
        private menuPaymentButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "about/payment");
        }

        public MenuContactButtonClick: { (e: any): void; };
        private menuContactButtonClick(e: any): boolean {
           return this.handleMenuItem(e, "about/contact");
        }

        public UserSettingsButtonClick: { (e: any): void; };
        private userSettingsButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/settings");
        }

        public UserMessagesButtonClick: { (e: any): void; };
        private userMessagesButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/messages");
        }
        public UserGarageButtonClick: { (e: any): void; };
        private userGarageButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/garage");
        }
        public UserOrdersButtonClick: { (e: any): void; };
        private userOrdersButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/orders");
        }

        private handleMenuItem(e: any, urlController: string): boolean {
            this.sideNav.sidenav('close');
            if (!utils.isNullOrEmpty(urlController))
                _app.OpenController({ urlController: urlController });
            e.preventDefault();
            return false;
        }
    }
}