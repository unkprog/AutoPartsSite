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
            LogIn() {
                this.Model.set('labelUserName', (vars._identity.Auth === true ? vars._identity.User.Email : ""));
                if (vars._identity.Auth !== true)
                    return;
                this.userMenuDropdown = $('<ul id="app-dropdown-user-menu" class="dropdown-content">'
                    + '<li><a href="/account/orders"><i class="material-icons">access_time</i><span>' + this.Model.get('labelOrders') + '<span></a></li>'
                    + '<li><a href="/account/garage"><i class="material-icons">time_to_leave</i><span data-bind="text:labelGarage">' + this.Model.get('labelGarage') + '<span></a></li>'
                    + '<li><a href="/account/messages"><i class="material-icons">message</i><span data-bind="text:labelMessages">' + this.Model.get('labelMessages') + '<span></a></li>'
                    + '<li class="divider" tabindex="-1"></li>'
                    + '<li><a href="/account/settings"><i class="material-icons">settings</i><span data-bind="text:labelSettings">' + this.Model.get('labelSettings') + '<span></a></li>'
                    + '</ul>');
                this.View.append(this.userMenuDropdown);
                this.userMenu = $('<li><a id="app-btn-user-menu" class="dropdown-trigger" data-target="app-dropdown-user-menu"><span>' + vars._identity.User.Email + '</span></a></li>');
                this.menuRight.find('#app-btn-login').find('.material-icons').html('exit_to_app');
                this.userMenu.insertBefore(this.menuRight);
                this.userMenu.find('.dropdown-trigger').dropdown({ constrainWidth: false });
            }
            LogOut() {
                if (this.userMenu)
                    this.userMenu.remove();
                if (this.userMenuDropdown)
                    this.userMenuDropdown.remove();
                if (this.menuRight)
                    this.menuRight.find('#app-btn-login').find('.material-icons').html('person_outline');
                vars._identity = { Auth: false, Token: '', User: null };
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
                this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, self);
                this.MenuSearchButtonClick = this.createClickEvent("main-view-btn-search", this.menuSearchButtonClick);
                this.MenuAboutButtonClick = this.createClickEvent("main-view-btn-about", this.menuAboutButtonClick);
            }
            destroyEvents() {
                this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);
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
                if (vars._identity.Auth === true) {
                    this.LogOut();
                    this.OpenController({ urlController: "search/index" });
                }
                else
                    this.OpenController({ urlController: "account/login" });
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