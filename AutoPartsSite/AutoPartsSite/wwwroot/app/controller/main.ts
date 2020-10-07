import vars = require('app/core/variables');
import ctrl = require('app/core/basecontroller');
import utils = require('app/core/utils');
import { _app, _main } from 'app/core/variables';

export namespace Controller {
    export class Main extends ctrl.Controller.BaseContent {

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
        private buttonMenu: JQuery;

        public ViewInit(view: JQuery): boolean {
            _app.SetControlNavigation(this);
            //this.Model.set("employee", vars._identity.employee);
            this.menu = $('<li><a id="app-btn-menu"><i class="material-icons">menu</i></a></li>');
            this.sideNav = view.find('#main-view-slide');
            this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
            $("#app-navbar").find(".left").append(this.menu);

            this.menuRight = $('<li><a id="app-btn-lang"><i class="material-icons">language</i></a></li><li><a id="app-btn-login" href="account/login"><i class="material-icons">account_circle</i></a></li>');
            $("#app-navbar").find(".right").append(this.menuRight);

            this.buttonMenu = this.menu.find("#app-btn-menu");
            this.content = view.find("#main-view-content");
            this.contentModal = view.find("#main-view-content-modal");
            super.ViewInit(view);
            this.navigateOnStart();
            return false;
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