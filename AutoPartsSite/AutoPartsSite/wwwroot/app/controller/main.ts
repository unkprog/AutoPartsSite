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
        private sideNav: JQuery;
        private sideNavBarRight: JQuery;
        private buttonMenu: JQuery;
        private userMenu: JQuery;

        public ViewInit(view: JQuery): boolean {
            _app.SetControlNavigation(this);
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

        private initLogIn() {
            this.menuRight = $('<li><a id="app-btn-login"><i class="material-icons">person_outline</i></a></li>');
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
            this.menu.find('#app-btn-lang').dropdown({ constrainWidth: false });
            
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
           
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);

            this.destroyClickEvent("app-lang-en", this.LangEnClick);
            this.destroyClickEvent("app-lang-ru", this.LangRuClick);

            this.destroyClickEvent("main-view-btn-about", this.MenuAboutButtonClick);
            this.destroyClickEvent("main-view-btn-search", this.MenuSearchButtonClick);
        }

        private navigateOnStart() {
            this.handleMenuItem("search/index");
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
        private menuSearchButtonClick(e) {
            this.handleMenuItem("search/index");
            e.preventDefault();
            return false;
        }

        public MenuAboutButtonClick: { (e: any): void; };
        private menuAboutButtonClick(e) {
            this.handleMenuItem("about/index");
            e.preventDefault();
            return false;
        }

        private handleMenuItem(urlController: string): void {
            this.sideNav.sidenav('close');
            if (!utils.isNullOrEmpty(urlController))
                _app.OpenController({ urlController: urlController });
        }
    }
}