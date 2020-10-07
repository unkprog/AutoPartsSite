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
                "client": { "name": "client@email.com", "phone":"+79991234567"},
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
        private userMenuDropdown: JQuery;

        public ViewInit(view: JQuery): boolean {
            _app.SetControlNavigation(this);
            //this.Model.set("employee", vars._identity.employee);
            this.menu = $('<li><a id="app-btn-menu"><i class="material-icons">menu</i></a></li><li><a id="app-btn-lang"><i class="material-icons">language</i></a></li>');
            this.sideNav = view.find('#main-view-slide');
            this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
           $("#app-navbar").find(".left").append(this.menu);

            this.menuRight = $('<li><a id="app-btn-login" href="account/login"><i class="material-icons">person_outline</i></a></li>');
            this.sideNavBarRight = $("#app-navbar").find(".right");
            this.sideNavBarRight.append(this.menuRight);

            this.buttonMenu = this.menu.find("#app-btn-menu");
            this.content = view.find("#main-view-content");
            this.contentModal = view.find("#main-view-content-modal");
            super.ViewInit(view);

            this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));

            this.navigateOnStart();
            return false;
        }

        public LogIn(): void {
            this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
            if (vars._identity.Auth !== true)
                return;

            this.userMenuDropdown = $('<ul id="app-dropdown-user-menu" class="dropdown-content">'
                + '<li><a href="/account/orders"><i class="material-icons">access_time</i><span data-bind="text:labelOrders"><span></a></li>'
                + '<li><a href="/account/garage"><i class="material-icons">time_to_leave</i><span data-bind="text:labelGarage"><span></a></li>'
                + '<li><a href="/account/messages"><i class="material-icons">message</i><span data-bind="text:labelMessages"><span></a></li>'
                + '<li class="divider" tabindex="-1"></li>'
                + '<li><a href="/account/settings"><i class="material-icons">settings</i><span data-bind="text:labelSettings"><span></a></li>'
                + '</ul>');
            this.View.append(this.userMenuDropdown);

            this.userMenu = $('<li><a id="app-btn-user-menu" class="dropdown-trigger btn" data-target="app-dropdown-user-menu"><span data-bind="text:labelUserName"><span></a></li>');
            this.menuRight.find('#app-btn-login').find('.material-icons').html('exit_to_app');
            this.menuRight.remove();
            this.sideNavBarRight.append(this.userMenu).append(this.menuRight);

            this.userMenu.find('.dropdown-trigger').dropdown({ constrainWidth: false });
        }

        public LogOut(): void {
            if (this.userMenu) this.userMenu.remove();
            if (this.userMenuDropdown) this.userMenuDropdown.remove();
            if (this.menuRight) this.menuRight.find('#app-btn-login').find('.material-icons').html('person_outline');
        }
        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            //this.LogIn();
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
            this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, self);

            this.MenuAboutButtonClick = this.createClickEvent("main-view-btn-about", this.menuAboutButtonClick);
           
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);

            this.destroyClickEvent("main-view-btn-about", this.MenuAboutButtonClick);
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
            if (vars._identity.Auth === true) {
                this.LogOut();
                this.OpenController({ urlController: "search/index" });
            }
            else
                this.OpenController({ urlController: "account/login" });
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