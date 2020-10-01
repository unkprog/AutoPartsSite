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
                "Header": "",
                "employee": {},
                "userDesc": "jdandturk@gmail.com",
                //"labelPOSterminal": vars._statres("label$POSterminal"),
                //"labelSettings": vars._statres("label$settings"),
                //"labelDocuments": vars._statres("label$documents"),
                //"labelReports":vars._statres("label$reports"),
                //"labelAbout":vars._statres("label$about"),
                //"labelExit":vars._statres("label$exit"),
            });
        }

        protected ControllersInit(): any {
            //return vars._maincontrollers;
            return vars._controllers;
        }

        private content: JQuery;
        private contentModal: JQuery;
        protected GetContent(): JQuery {
            return this.content;
        }

        private menu: JQuery;
        private sideNav: JQuery;
        private buttonMenu: JQuery;
        public ViewInit(view: JQuery): boolean {
            _app.SetControlNavigation(this);
            //this.Model.set("employee", vars._identity.employee);
            this.menu = $('<li><a id="app-btn-menu"><i class="material-icons">menu</i></a></li>');
            this.sideNav = view.find('#main-view-slide');
            this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
            $("#app-navbar").find(".left").append(this.menu);
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

            this.MenuPOSTerminalButtonClick = this.createClickEvent("main-view-btn-posterminal", this.menuPOSTerminalButtonClick);
            this.MenuSettingsButtonClick = this.createClickEvent("main-view-btn-settings", this.menuSettingsButtonClick);
            this.MenuDocumentsButtonClick = this.createClickEvent("main-view-btn-documents", this.menuDocumentsButtonClick);
            this.MenuReportsButtonClick = this.createClickEvent("main-view-btn-reports", this.menuReportsButtonClick);
            this.MenuAboutButtonClick = this.createClickEvent("main-view-btn-about", this.menuAboutButtonClick);
            this.MenuExitButtonClick = this.createClickEvent("main-view-btn-exit", this.menuExitButtonClick);
           
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);

            this.destroyClickEvent("main-view-btn-posterminal", this.MenuPOSTerminalButtonClick);
            this.destroyClickEvent("main-view-btn-settings", this.MenuSettingsButtonClick);
            this.destroyClickEvent("main-view-btn-documents", this.MenuDocumentsButtonClick);
            this.destroyClickEvent("main-view-btn-reports", this.MenuReportsButtonClick);
            this.destroyClickEvent("main-view-btn-about", this.MenuAboutButtonClick);
            this.destroyClickEvent("main-view-btn-exit", this.MenuExitButtonClick);
        }

        private navigateOnStart() {
            this.handleMenuItem("search/index");
            //if (vars._identity.employee.openonlogin === 1)
            //    this.MenuSettingsButtonClick({});
            //else if (vars._identity.employee.openonlogin === 2)
            //    this.MenuDocumentsButtonClick({});
            //else if (vars._identity.employee.openonlogin === 3)
            //    this.MenuReportsButtonClick({});
            //else
            //    this.MenuPOSTerminalButtonClick({});
        }

        public OpenMenuButtonClick: { (e: any): void; };
        private openMenuButtonClick(e) {
            e.preventDefault();
            e.stopPropagation();
            this.sideNav.sidenav('open');
        }

        public MenuPOSTerminalButtonClick: { (e: any): void; };
        private menuPOSTerminalButtonClick(e) {
            this.handleMenuItem("terminal/index");
        }

        public MenuSettingsButtonClick: { (e: any): void; };
        private menuSettingsButtonClick(e) {
            this.handleMenuItem("setting/index");
        }


        public MenuDocumentsButtonClick: { (e: any): void; };
        private menuDocumentsButtonClick(e) {
            this.handleMenuItem("document/index");
        }

        public MenuReportsButtonClick: { (e: any): void; };
        private menuReportsButtonClick(e) {
            this.handleMenuItem("report/index");
        }

        public MenuAboutButtonClick: { (e: any): void; };
        private menuAboutButtonClick(e) {
            this.handleMenuItem("about/index");
        }

        public MenuExitButtonClick: { (e: any): void; };
        private menuExitButtonClick(e) {
            this.sideNav.sidenav('close');
            _app.OpenController({ urlController: "security/login" });
        }

        private handleMenuItem(urlController: string): void {
            this.sideNav.sidenav('close');
            if (!utils.isNullOrEmpty(urlController))
                _app.OpenController({ urlController: urlController });

           // nativeBridge.showMessage('Message from JS');
        }
    }
}