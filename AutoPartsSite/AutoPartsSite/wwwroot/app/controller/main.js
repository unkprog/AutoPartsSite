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
                    "labelAbout": vars._statres("label$aboutUs"),
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
            ViewHide(e) {
                super.ViewHide(e);
                if (this.menu)
                    this.menu.remove();
            }
            createEvents() {
                this.OpenMenuButtonClick = this.createTouchClickEvent(this.buttonMenu, this.openMenuButtonClick);
                let self = this;
                this.AppTitleClick = utils.createClickEvent("app-title", this.appTitleClick, self);
                this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, self);
                this.MenuAboutButtonClick = this.createClickEvent("main-view-btn-about", this.menuAboutButtonClick);
            }
            destroyEvents() {
                this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);
                this.destroyClickEvent("main-view-btn-about", this.MenuAboutButtonClick);
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
                this.OpenController({ urlController: "account/login" });
                e.preventDefault();
                return false;
            }
            menuAboutButtonClick(e) {
                this.handleMenuItem("about/index");
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