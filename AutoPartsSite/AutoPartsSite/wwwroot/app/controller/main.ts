﻿import vars = require('app/core/variables');
import ctrl = require('app/core/basecontroller');
import utils = require('app/core/utils');
import { _app, _main } from 'app/core/variables';
import acc = require('app/services/accountservice');

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

                "labelPolicies": vars._statres("label$policies"),
                "labelTermsConditions": vars._statres("label$termsconditions"),

                "labelUserName": "",
                "labelOrders": vars._statres("label$orders"),
                "labelGarage": vars._statres("label$garage"),
                "labelMessages": vars._statres("label$messages"),
                "labelSettings": vars._statres("label$settings"),

                "labelVersion": ""
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
        private menuCms: JQuery;
        private foother: JQuery;

        public ViewInit(view: JQuery): boolean {
            _app.SetControlNavigation(this);
            this.Model.set("labelVersion", vars._appData.Version);
            this.menu = $('<li><a id="app-btn-menu" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$menu") + '"><i class="material-icons">menu</i></a></li>');
           
            this.sideNav = view.find('#main-view-slide');
            this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
            $("#app-navbar").find(".left").append(this.menu);

            this.sideNavBarRight = $("#app-navbar").find(".right");
            this.menuLang = $('<li><a id="app-btn-lang" class="dropdown-trigger tooltipped" data-target="app-dropdown-lang-menu" data-position="bottom" data-tooltip="' + vars._statres("label$language") + '"><img class="app-flag-icon" src="/img/flags/' + vars._appData.Locale + '.svg"/></a></li>');
            this.menuBasket = $('<li><a id="app-btn-basket" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$basket") + '"><i class="material-icons">shopping_cart</i></a><div class="center app-basket-counter">0</div></li>');
            this.sideNavBarRight.append(this.menuLang).append(this.menuBasket);
            this.menuBasket.find('.app-basket-counter').hide();

            this.buttonMenu = this.menu.find("#app-btn-menu");
            this.content = view.find("#main-view-content");
            this.contentModal = view.find("#main-view-content-modal");
            this.foother = view.find("#main-view-footer");
            super.ViewInit(view);

            this.Model.set('labelUserName', (vars._appData.Identity.Auth === true ? vars._appData.Identity.User.Email : ""));
            this.initLogIn();

            _app.OpenController({ urlController: "search/index" });
            return false;
        }

        private initLogIn() {
            vars._appData.IsBasketCheckOut = false;
            this.menuRight = $('<li><a id="app-btn-login" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$account") + '"><i class="material-icons">person_outline</i></a></li>');
            this.sideNavBarRight.append(this.menuRight);
            this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, this);
            
        }

        public LogIn(): void {
          
            this.Model.set('labelUserName', (vars._appData.Identity.Auth === true ? vars._appData.Identity.User.Email : ""));
            if (vars._appData.Identity.Auth !== true)
                return;

            if (vars._appData.Identity.Cms === true) {
                this.menuCms = $('<li><a id="main-view-btn-cms" href><i class="material-icons">wysiwyg</i><span>CMS</span></a></li>');
                $('#main-view-slide').append(this.menuCms);
                this.CmsButtonClick = this.createClickEvent("main-view-btn-cms", this.cmsButtonClick);
            }

            this.userMenu = $('<li><a id="app-btn-user-menu" class="dropdown-trigger" data-target="app-dropdown-user-menu"><i class="material-icons">account_circle</i></a></li>');
            this.menuRight.find('#app-btn-login').remove();
            this.sideNavBarRight.append(this.userMenu);

            this.initUserMenu();
            this.LogoutClick = utils.createClickEvent("app-user-logout", this.logoutClick, this);
        }

        public LogOut(): void {
            _app.ShowLoading(true);
            let accountService = new acc.Services.AccountService();
            accountService.Logout((responseData) => {
                vars._appData.Identity = { Auth: false, Cms: false, Token: '', User: null, SiteUserId: 0 };
                if (this.menuCms) {
                    this.destroyClickEvent("main-view-btn-cms", this.MenuContactButtonClick);
                    this.menuCms.remove();
                }
                _app.HideLoading();
            });
        }

        private initUserMenu() {
            let mddt = this.userMenu.find('.dropdown-trigger');
            if (mddt)
                mddt.dropdown({ constrainWidth: false });
        }
        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            this.menuLang.find('#app-btn-lang').dropdown({ constrainWidth: false });
            
            $("#app-navbar").find('.tooltipped').tooltip();
            this.LogIn();
            return result;
        }

        public ViewHide(e) {
            super.ViewHide(e);
            if (this.menu)
                this.menu.remove();
        }

        protected OnSetViewSize(e: any) {
            let content = this.GetContent();
            let footerHeight = this.foother.innerHeight(), height = window.innerHeight - footerHeight;
            //let childsHeight = footerHeight;
            //content.children().each(function () {
            //    childsHeight += $(this).innerHeight();
            //});
            //;
            //if (height < childsHeight)
            //    height = childsHeight;
            ////content.height(height);
            content.css("min-height", height);
        }

        protected createEvents(): void {
            let self = this;

            self.AppTitleClick = utils.createClickEvent($("#app-title"), self.appTitleClick, self);

            self.OpenMenuButtonClick = self.createTouchClickEvent(self.buttonMenu, self.openMenuButtonClick);


            self.LangEnClick = self.createClickEvent("app-lang-en", self.langEnClick);
            self.LangRuClick = self.createClickEvent("app-lang-ru", self.langRuClick);

            self.BasketButtonClick = self.createClickEvent(self.menuBasket.find("#app-btn-basket"), self.basketButtonClick);
            //this.BasketButtonClick = utils.createClickEvent("app-btn-basket", this.basketButtonClick, this.View);

            self.MenuSearchButtonClick = self.createClickEvent("main-view-btn-search", self.menuSearchButtonClick);
            self.MenuAboutButtonClick = self.createClickEvent("main-view-btn-about", self.menuAboutButtonClick);
            self.MenuNewsButtonClick = self.createClickEvent("main-view-btn-news", self.menuNewsButtonClick);
            self.MenuFaqButtonClick = self.createClickEvent("main-view-btn-faq", self.menuFaqButtonClick);
            self.MenuPaymentButtonClick = self.createClickEvent("main-view-btn-payment", self.menuPaymentButtonClick);
            self.MenuShippingButtonClick = self.createClickEvent("main-view-btn-shipping", self.menuShippingButtonClick);
            self.MenuContactButtonClick = self.createClickEvent("main-view-btn-contact", self.menuContactButtonClick);
            self.MenuSettingsButtonClick = self.createClickEvent("main-view-btn-settings", self.menuSettingsButtonClick);

            self.FContactButtonClick = self.createClickEvent("footer-view-btn-contact", self.fContactButtonClick);
            self.FFaqButtonClick = self.createClickEvent("footer-view-btn-faq", self.fFaqButtonClick);
            self.FAboutButtonClick = self.createClickEvent("footer-view-btn-about", self.fAboutButtonClick);
            self.FPoliciesAboutButtonClick = self.createClickEvent("footer-view-btn-policies", self.fPoliciesAboutButtonClick);
            self.FTermsAboutButtonClick = self.createClickEvent("footer-view-btn-terms", self.fTermsAboutButtonClick);
            self.FNewsButtonClick = self.createClickEvent("footer-view-btn-news", self.fNewsButtonClick);


            self.UserOrdersButtonClick = self.createClickEvent("app-user-orders", self.userOrdersButtonClick);
            self.UserGarageButtonClick = self.createClickEvent("app-user-garage", self.userGarageButtonClick);
            self.UserMessagesButtonClick = self.createClickEvent("app-user-messages", self.userMessagesButtonClick);
            self.UserSettingsButtonClick = self.createClickEvent("app-user-settings", self.userSettingsButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);

            this.destroyClickEvent("app-lang-en", this.LangEnClick);
            this.destroyClickEvent("app-lang-ru", this.LangRuClick);

            //utils.destroyClickEvent("app-btn-basket", this.BasketButtonClick, this.View);
            this.destroyClickEvent(this.menuBasket.find("#app-btn-basket"), this.BasketButtonClick);

            this.destroyClickEvent("main-view-btn-settings", this.MenuSettingsButtonClick);
            this.destroyClickEvent("main-view-btn-contact", this.MenuContactButtonClick);
            this.destroyClickEvent("main-view-btn-shipping", this.MenuShippingButtonClick);
            this.destroyClickEvent("main-view-btn-payment", this.MenuPaymentButtonClick);
            this.destroyClickEvent("main-view-btn-faq", this.MenuFaqButtonClick);
            this.destroyClickEvent("main-view-btn-news", this.MenuNewsButtonClick);
            this.destroyClickEvent("main-view-btn-about", this.MenuAboutButtonClick);
            this.destroyClickEvent("main-view-btn-search", this.MenuSearchButtonClick);

            this.destroyClickEvent("footer-view-btn-contact", this.FContactButtonClick);
            this.destroyClickEvent("footer-view-btn-faq", this.FFaqButtonClick);
            this.destroyClickEvent("footer-view-btn-about", this.FAboutButtonClick);
            this.destroyClickEvent("footer-view-btn-news", this.FNewsButtonClick);

            this.destroyClickEvent("footer-view-btn-policies", this.FPoliciesAboutButtonClick);
            this.destroyClickEvent("footer-view-btn-terms", this.FTermsAboutButtonClick);

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
            this.handleMenuItem(e, "search/index");
        }

        public LoginClick: { (e: any): void; };
        private loginClick(e) {
            if (vars._appData.Identity.Auth !== true) {
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
            vars._appData.Locale = "en";//            vars._app.changeLocale("en");
            location.reload();
            e.preventDefault();
            return false;
        }

        public LangRuClick: { (e: any): void; };
        private langRuClick(e) {
            vars._appData.Locale = "ru";//            vars._app.changeLocale("ru");
            location.reload();
            e.preventDefault();
            return false;
        }

        public BasketButtonClick: { (e: any): void; };
        private basketButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "basket/index");
        }

        public MenuSearchButtonClick: { (e: any): void; };
        private menuSearchButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "search/index");
        }

        public MenuAboutButtonClick: { (e: any): void; };
        private menuAboutButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/index", "label$aboutUs");
        }

        public MenuNewsButtonClick: { (e: any): void; };
        private menuNewsButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "news/index");
        }

        public MenuFaqButtonClick: { (e: any): void; };
        private menuFaqButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/faq", "label$faq");
        }

        public MenuShippingButtonClick: { (e: any): void; };
        private menuShippingButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/shipping", "label$shipping");
        }

        public MenuPaymentButtonClick: { (e: any): void; };
        private menuPaymentButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/payment", "label$payment");
        }

        public MenuContactButtonClick: { (e: any): void; };
        private menuContactButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/contact", "label$contacts");
        }

        public MenuSettingsButtonClick: { (e: any): void; };
        private menuSettingsButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/settings");
        }

        public CmsButtonClick: { (e: any): void; };
        private cmsButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "cms/index");
        }

        public FContactButtonClick: { (e: any): void; };
        private fContactButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/contact", "label$contacts");
        }

        public FFaqButtonClick: { (e: any): void; };
        private fFaqButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/faq", "label$faq");
        }

        public FAboutButtonClick: { (e: any): void; };
        private fAboutButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/index", "label$aboutUs");
        }

        public FPoliciesAboutButtonClick: { (e: any): void; };
        private fPoliciesAboutButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/policies", "label$policies");
        }

        public FTermsAboutButtonClick: { (e: any): void; };
        private fTermsAboutButtonClick(e: any): boolean {
            return this.handleMenuItemPage(e, "about/termsconditions", "label$termsconditions");
        }

        public FNewsButtonClick: { (e: any): void; };
        private fNewsButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "news/index");
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

        private handleMenuItemPage(e: any, urlController: string, pageEditItemHeader: string) {
            vars._appData.PageEditItemHeader = pageEditItemHeader;
            return this.handleMenuItem(e, urlController);
        }

        private handleMenuItem(e: any, urlController: string): boolean {
            this.sideNav.sidenav('close');
            if (!utils.isNullOrEmpty(urlController))
                _app.OpenController({ urlController: urlController });
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
}