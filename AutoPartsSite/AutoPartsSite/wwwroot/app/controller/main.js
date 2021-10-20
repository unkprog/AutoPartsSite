var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/core/utils", "app/core/variables", "app/services/accountservice", "app/services/searchservice"], function (require, exports, vars, ctrl, utils, variables_1, acc, srh) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Main = (function (_super) {
            __extends(Main, _super);
            function Main() {
                var _this = _super.call(this) || this;
                vars._main = _this;
                return _this;
            }
            Main.prototype.createOptions = function () {
                return { Url: "/app/controller/main.html", Id: "main-view" };
            };
            Main.prototype.createModel = function () {
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
                    "labelShippingDestination": vars._statres("label$shipping$destination"),
                    "labelLanguage": vars._statres("label$language"),
                    "labelCurrency": vars._statres("label$currency"),
                    "labelSave": vars._statres("button$label$save"),
                    "labelCancel": vars._statres("button$label$cancel"),
                    "labelPolicies": vars._statres("label$policies"),
                    "labelTermsConditions": vars._statres("label$termsconditions"),
                    "labelUserName": "",
                    "labelOrders": vars._statres("label$orders"),
                    "labelGarage": vars._statres("label$garage"),
                    "labelMessages": vars._statres("label$messages"),
                    "labelSettings": vars._statres("label$settings"),
                    "labelExit": vars._statres("button$label$exit"),
                    "labelCustomerService": vars._statres("label$customer$service"),
                    "labelInformation": vars._statres("label$information"),
                    "labelVersion": "",
                    "SettingsData": { "Countries": [], "Languages": [], "Currencies": [] },
                    "labelRequest": vars._statres("label$ask$question"),
                    "labelName": vars._statres("label$ask$name"),
                    "labelEmail": vars._statres("label$email"),
                    "labelQuestion": vars._statres("label$howcan$help"),
                    "labelSend": vars._statres("label$send"),
                    "AskQuestion": {
                        Id: 0, ReplyId: 0,
                        Name: "",
                        Email: "",
                        Question: ""
                    },
                });
            };
            Main.prototype.ControllersInit = function () {
                return vars._controllers;
            };
            Main.prototype.GetContent = function () {
                return this.content;
            };
            Main.prototype.ViewInit = function (view) {
                variables_1._app.SetControlNavigation(this);
                this.Model.set("labelVersion", vars._appData.Version);
                this.menu = $('<li><a id="app-btn-menu" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$menu") + '"><i class="material-icons">menu</i></a></li>');
                this.sideNav = view.find('#main-view-slide');
                this.sideNav.sidenav({ edge: 'left', closeOnClick: false, draggable: false });
                $("#app-navbar").find(".left").append(this.menu);
                this.sideNavBarRight = $("#app-navbar").find(".right");
                this.menuSettings = $('<li><a class="modal-trigger" href="#app-settings-modal"></a></li>');
                this.menuCountry = $('<span id="app-btn-country" style="margin: 0 0.5rem 0 0;">' + vars._appData.Settings.Country.Code + '<span>');
                this.menuLang = $('<img class="app-flag-icon" style="margin-top:-4px;width:1.5rem;height:1.35em;" src="/img/flags/' + vars._appData.Locale.Code.toLowerCase() + '.svg"/>');
                this.menuCurrency = $('<span id="app-btn-currency" style="margin: 0 0 0 0.5rem;">' + vars._appData.Settings.Currency.Code + '<span>');
                this.menuSettings.find('a').append(this.menuCountry).append(this.menuLang).append(this.menuCurrency);
                this.menuBasket = $('<li><a id="app-btn-basket" data-position="bottom"><i class="material-icons">shopping_cart</i></a><div class="center app-basket-counter">0</div></li>');
                this.sideNavBarRight.append(this.menuSettings).append(this.menuBasket);
                this.menuBasket.find('.app-basket-counter').hide();
                this.menuAskRequest = $('<li id="app-btn-askrequest"><a><i class="material-icons">contact_support</i></a></li>');
                this.sideNavBarRight.append(this.menuAskRequest);
                this.buttonMenu = this.menu.find("#app-btn-menu");
                this.content = view.find("#main-view-content");
                this.contentModal = view.find("#main-view-content-modal");
                this.foother = view.find("#main-view-footer");
                _super.prototype.ViewInit.call(this, view);
                this.Model.set('labelUserName', (vars._appData.Identity.Auth === true ? vars._appData.Identity.User.Email : ""));
                this.initLogIn();
                var startupPage = localStorage.getItem('startupPage');
                localStorage.removeItem('startupPage');
                if (utils.isNullOrEmpty(startupPage))
                    variables_1._app.OpenController({ urlController: "search/index" });
                else {
                    variables_1._app.OpenController({ urlController: startupPage });
                }
                return false;
            };
            Main.prototype.initLogIn = function () {
                vars._appData.IsBasketCheckOut = false;
                this.menuRight = $('<li><a id="app-btn-login" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("label$account") + '"><i class="material-icons">person_outline</i></a></li>');
                this.sideNavBarRight.append(this.menuRight);
                this.LoginClick = utils.createClickEvent("app-btn-login", this.loginClick, this);
            };
            Main.prototype.LogIn = function () {
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
            };
            Main.prototype.LogOut = function () {
                var _this = this;
                variables_1._app.ShowLoading(true);
                var accountService = new acc.Services.AccountService();
                accountService.Logout(function (responseData) {
                    vars._appData.Identity = { Auth: false, Cms: false, Token: '', User: null, SiteUserId: 0 };
                    utils.destroyClickEvent("app-user-logout", _this.LogoutClick);
                    if (_this.menuCms) {
                        _this.destroyClickEvent("main-view-btn-cms", _this.MenuContactButtonClick);
                        _this.menuCms.remove();
                    }
                    variables_1._app.HideLoading();
                });
            };
            Main.prototype.initUserMenu = function () {
                var mddt = this.userMenu.find('.dropdown-trigger');
                if (mddt)
                    mddt.dropdown({ constrainWidth: false });
            };
            Main.prototype.ViewShow = function (e) {
                var result = _super.prototype.ViewShow.call(this, e);
                $("#app-navbar").find('.tooltipped').tooltip();
                this.LogIn();
                return result;
            };
            Main.prototype.ViewHide = function (e) {
                _super.prototype.ViewHide.call(this, e);
                if (this.menu)
                    this.menu.remove();
            };
            Main.prototype.OnSetViewSize = function (e) {
                var content = this.GetContent();
                var footerHeight = this.foother.innerHeight(), height = window.innerHeight - footerHeight;
                content.css("min-height", height);
            };
            Main.prototype.createEvents = function () {
                var self = this;
                self.AppTitleClick = utils.createClickEvent($("#app-title"), self.appTitleClick, self);
                self.AppTitleLogoClick = utils.createClickEvent($("#app-title-logo"), self.appTitleLogoClick, self);
                self.OpenMenuButtonClick = self.createTouchClickEvent(self.buttonMenu, self.openMenuButtonClick);
                self.MenuSettingsClick = utils.createClickEvent(self.menuSettings, self.menuSettingsClick, self);
                var el = self.View.find('#app-askquestion-send-btn');
                self.SendAskRequestButtonClick = utils.createClickEvent(el, self.sendAskRequestButtonClick, self);
                el = self.View.find('#app-askquestion-send-btn-cancel');
                self.SendAskRequestCancelButtonClick = utils.createClickEvent(el, self.sendAskRequestCancelButtonClick, self);
                self.MenuCountryClick = utils.createClickEvent($("#app-btn-country"), self.menuCountryClick, self);
                self.MenuLangClick = utils.createClickEvent($("#app-btn-lang"), self.menuLangClick, self);
                self.MenuCurrencyClick = utils.createClickEvent($("#app-btn-currency"), self.menuCurrencyClick, self);
                self.MenuAskQuestionClick = utils.createClickEvent(self.menuAskRequest, self.fAskQuestionButtonClick, self);
                self.AppSettingsSaveButtonClick = this.createClickEvent("app-settings-modal-btn-save", self.appSettingsSaveButtonClick);
                self.BasketButtonClick = self.createClickEvent(self.menuBasket.find("#app-btn-basket"), self.basketButtonClick);
                self.MenuSearchButtonClick = self.createClickEvent("main-view-btn-search", self.menuSearchButtonClick);
                self.MenuAboutButtonClick = self.createClickEvent("main-view-btn-about", self.menuAboutButtonClick);
                self.MenuNewsButtonClick = self.createClickEvent("main-view-btn-news", self.menuNewsButtonClick);
                self.MenuFaqButtonClick = self.createClickEvent("main-view-btn-faq", self.menuFaqButtonClick);
                self.MenuPaymentButtonClick = self.createClickEvent("main-view-btn-payment", self.menuPaymentButtonClick);
                self.MenuShippingButtonClick = self.createClickEvent("main-view-btn-shipping", self.menuShippingButtonClick);
                self.MenuContactButtonClick = self.createClickEvent("main-view-btn-contact", self.menuContactButtonClick);
                self.MenuAskQuestionClick2 = utils.createClickEvent("main-view-btn-askrequest", self.fAskQuestionButtonClick, self, self.View);
                self.MenuSettingsButtonClick = self.createClickEvent("main-view-btn-settings", self.menuSettingsButtonClick);
                self.FContactButtonClick = self.createClickEvent("footer-view-btn-contact", self.fContactButtonClick);
                self.FFaqButtonClick = self.createClickEvent("footer-view-btn-faq", self.fFaqButtonClick);
                self.FAskQuestionButtonClick = self.createClickEvent("footer-view-btn-askquestion", self.fAskQuestionButtonClick);
                self.FAboutButtonClick = self.createClickEvent("footer-view-btn-about", self.fAboutButtonClick);
                self.FPoliciesAboutButtonClick = self.createClickEvent("footer-view-btn-policies", self.fPoliciesAboutButtonClick);
                self.FTermsAboutButtonClick = self.createClickEvent("footer-view-btn-terms", self.fTermsAboutButtonClick);
                self.FNewsButtonClick = self.createClickEvent("footer-view-btn-news", self.fNewsButtonClick);
                self.UserProfileButtonClick = self.createClickEvent("app-user-profile", self.userProfileButtonClick);
                self.UserOrdersButtonClick = self.createClickEvent("app-user-orders", self.userOrdersButtonClick);
                self.UserMessagesButtonClick = self.createClickEvent("app-user-messages", self.userMessagesButtonClick);
            };
            Main.prototype.destroyEvents = function () {
                this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);
                utils.destroyClickEvent(this.View.find('#app-askquestion-send-btn'), this.SendAskRequestButtonClick);
                utils.destroyClickEvent(this.View.find('#app-askquestion-send-btn-cancel'), this.SendAskRequestCancelButtonClick);
                utils.destroyClickEvent(this.menuSettings, this.MenuSettingsClick);
                utils.destroyClickEvent($("#app-btn-currency"), this.MenuCurrencyClick);
                utils.destroyClickEvent($("#app-btn-lang"), this.MenuLangClick);
                utils.destroyClickEvent($("#app-btn-country"), this.MenuCountryClick);
                this.destroyClickEvent("app-settings-modal-btn-save", this.AppSettingsSaveButtonClick);
                this.destroyClickEvent(this.menuBasket.find("#app-btn-basket"), this.BasketButtonClick);
                this.destroyClickEvent(this.menuAskRequest, this.MenuAskQuestionClick);
                this.destroyClickEvent("main-view-btn-askrequest", this.MenuAskQuestionClick2);
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
                this.destroyClickEvent("footer-view-btn-askquestion", this.FAskQuestionButtonClick);
                this.destroyClickEvent("footer-view-btn-about", this.FAboutButtonClick);
                this.destroyClickEvent("footer-view-btn-news", this.FNewsButtonClick);
                this.destroyClickEvent("footer-view-btn-policies", this.FPoliciesAboutButtonClick);
                this.destroyClickEvent("footer-view-btn-terms", this.FTermsAboutButtonClick);
                this.destroyClickEvent("app-user-profile", this.UserProfileButtonClick);
                this.destroyClickEvent("app-user-messages", this.UserMessagesButtonClick);
                this.destroyClickEvent("app-user-orders", this.UserOrdersButtonClick);
            };
            Main.prototype.openMenuButtonClick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.sideNav.sidenav('open');
            };
            Main.prototype.appTitleClick = function (e) {
                this.handleMenuItem(e, "search/index");
            };
            Main.prototype.appTitleLogoClick = function (e) {
                this.handleMenuItem(e, "search/index");
            };
            Main.prototype.loginClick = function (e) {
                if (vars._appData.Identity.Auth !== true) {
                    this.OpenController({ urlController: "account/login" });
                    e.preventDefault();
                    return false;
                }
            };
            Main.prototype.logoutClick = function (e) {
                this.LogOut();
                location.reload();
                e.preventDefault();
                return false;
            };
            Main.prototype.OpenRequest = function () {
                if (vars._appData.Identity && vars._appData.Identity.User && vars._appData.Identity.User.Email && !utils.isNullOrEmpty(vars._appData.Identity.User.Email))
                    this.Model.set("AskQuestion.Email", vars._appData.Identity.User.Email);
                var artikle = localStorage.getItem("artikle");
                localStorage.removeItem("artikle");
                if (!utils.isNullOrEmpty(artikle)) {
                    this.Model.set("AskQuestion.Question", vars._statres("label$ask$partnumber$available") + ' - ' + artikle + '?');
                }
                else
                    this.Model.set("AskQuestion.Question", "");
                this.sideNav.sidenav('close');
                $('#askquestion-view-question').characterCounter();
                if (!this.appRequestModal)
                    this.appRequestModal = $('#app-request-modal').modal();
                M.updateTextFields();
                this.appRequestModal.modal('open');
            };
            Main.prototype.askRequestButtonClick = function (e) {
                this.OpenRequest();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.sendAskRequestButtonClick = function (e) {
                var question = this.Model.get("AskQuestion").toJSON();
                if (this.validateQuestion(question)) {
                    vars._app.ShowLoading(false);
                    var self_1 = this;
                    var searchService = new srh.Services.SearchService();
                    searchService.SendAskQuestion(question, function (responseData) {
                        if (responseData.Result === 0) {
                            self_1.appRequestModal.modal('close');
                            M.toast({ html: vars._statres("message$ask$question$sent") });
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.sendAskRequestCancelButtonClick = function (e) {
                this.appRequestModal.modal('close');
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.validateQuestion = function (model) {
                var result = true;
                if (!utils.validateEmail(model.Email)) {
                    M.toast({ html: vars._statres("msg$error$emailIncorrect") });
                    result = false;
                }
                if (utils.isNullOrEmpty(model.Question)) {
                    M.toast({ html: vars._statres("label$ask$question$incorrect") });
                    result = false;
                }
                return result;
            };
            Main.prototype.menuSettingsClick = function (e) {
                this.openSettings();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.menuCountryClick = function (e) {
                this.openSettings();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.menuLangClick = function (e) {
                this.openSettings();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.menuCurrencyClick = function (e) {
                this.openSettings();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.openSettings = function () {
                var self = this;
                self.sideNav.sidenav('close');
                self.saveLocaleId = vars._appData.Locale && vars._appData.Locale.Id ? vars._appData.Locale.Id : 0;
                self.saveCurrencyId = vars._appData.Settings && vars._appData.Settings.Currency && vars._appData.Settings.Currency.Id ? vars._appData.Settings.Currency.Id : 0;
                self.saveCountryId = vars._appData.Settings && vars._appData.Settings.Country && vars._appData.Settings.Country.Id ? vars._appData.Settings.Country.Id : 0;
                self.currentLocaleId = self.saveLocaleId;
                self.currentCurrencyId = self.saveCurrencyId;
                self.currentCountryId = self.saveCountryId;
                self.openSettingsWithLocale(self.saveLocaleId);
            };
            Main.prototype.openSettingsWithLocale = function (localeId) {
                var self = this;
                vars._app.ShowLoading(true);
                var accountService = new acc.Services.AccountService();
                accountService.SettingsData(localeId, vars._appData.Settings === null, function (responseData) {
                    if (responseData.Result === 0) {
                        self.Model.set("SettingsData", responseData.Data);
                        self.setupLists();
                    }
                    else {
                        vars._app.ShowError(responseData.Error);
                    }
                    vars._app.HideLoading();
                });
            };
            Main.prototype.setupLists = function () {
                var self = this;
                var settingsData = self.Model.get("SettingsData");
                var settings = vars._appData.Settings;
                if (settings == null)
                    settings = settingsData.Current;
                var setSelectClass = function (sj, cls) {
                    var el = sj[0];
                    var elJq = $(el.M_FormSelect.dropdown.dropdownEl);
                    if (elJq.hasClass(cls) == false)
                        elJq.addClass(cls);
                    return sj;
                };
                var html = '';
                for (var i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                    html = html + '<option value="' + settingsData.Countries[i].Id + '" ' + (self.currentCountryId == settingsData.Countries[i].Id ? 'selected' : '') + '>';
                    html = html + settingsData.Countries[i].Name + '</option>';
                }
                self.setCountryQ = $('#app-settings-modal-list-country').html(html).formSelect();
                setSelectClass(self.setCountryQ, 'select-max-height-650');
                html = '';
                for (var i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                    html = html + '<option value="' + settingsData.Languages[i].Id + '" ' + (self.currentLocaleId == settingsData.Languages[i].Id ? 'selected' : '') + '>';
                    html = html + settingsData.Languages[i].Name + '</option>';
                }
                self.setLangQ = $('#app-settings-modal-list-lang').html(html).formSelect();
                setSelectClass(self.setLangQ, 'select-max-height-450');
                var changeLangQ = function (e) {
                    self.setLangQ.off('change');
                    self.currentLocaleId = parseInt(self.setLangQ.val(), 0);
                    self.currentCurrencyId = parseInt(self.setCurrencyQ.val(), 0);
                    self.currentCountryId = parseInt(self.setCountryQ.val(), 0);
                    M.FormSelect.getInstance(self.setCountryQ[0]).destroy();
                    M.FormSelect.getInstance(self.setLangQ[0]).destroy();
                    M.FormSelect.getInstance(self.setCurrencyQ[0]).destroy();
                    self.openSettingsWithLocale(self.currentLocaleId);
                };
                self.setLangQ.on('change', changeLangQ);
                html = '';
                for (var i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                    html = html + '<option value="' + settingsData.Currencies[i].Id + '" ' + (self.currentCurrencyId == settingsData.Currencies[i].Id ? 'selected' : '') + '>';
                    html = html + settingsData.Currencies[i].Name + '</option>';
                }
                self.setCurrencyQ = $('#app-settings-modal-list-currency').html(html).formSelect();
                setSelectClass(self.setCurrencyQ, 'select-max-height-300');
                if (!this.appSettingsModal)
                    this.appSettingsModal = $('#app-settings-modal').modal();
                this.appSettingsModal.modal('open');
            };
            Main.prototype.appSettingsSaveButtonClick = function (e) {
                this.saveSettingsData();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.saveSettingsData = function () {
                var _this = this;
                var self = this;
                var vsettingsData = this.Model.get("SettingsData");
                var vsettings = vars._appData.Settings;
                self.currentLocaleId = parseInt(self.setLangQ.val(), 0);
                self.currentCurrencyId = parseInt(self.setCurrencyQ.val(), 0);
                self.currentCountryId = parseInt(self.setCountryQ.val(), 0);
                this.appSettingsModal.modal('close');
                vars._app.ShowLoading(true);
                var setReload = function (isForce, settingsData, settings) {
                    if (isForce == true || self.currentCountryId !== self.saveCountryId) {
                        for (var i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                            if (settingsData.Countries[i].Id === self.currentCountryId) {
                                settings.Country = {
                                    Id: settingsData.Countries[i].Id,
                                    Code: settingsData.Countries[i].Code,
                                    Name: settingsData.Countries[i].Name
                                };
                                $("#app-btn-country").html(settings.Country.Code);
                                break;
                            }
                        }
                    }
                    if (isForce == true || self.currentCurrencyId !== self.saveCurrencyId) {
                        for (var i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                            if (settingsData.Currencies[i].Id === self.currentCurrencyId) {
                                settings.Currency = {
                                    Id: settingsData.Currencies[i].Id,
                                    Code: settingsData.Currencies[i].Code,
                                    Name: settingsData.Currencies[i].Name,
                                    Symbol: settingsData.Currencies[i].Symbol,
                                    ShowLeft: settingsData.Currencies[i].ShowLeft
                                };
                                $("#app-btn-currency").html(settings.Currency.Code);
                                break;
                            }
                        }
                    }
                };
                setReload(false, vsettingsData, vsettings);
                var isReloadForce = false;
                if (self.currentLocaleId !== self.saveLocaleId) {
                    for (var i = 0, icount = vsettingsData.Languages.length; i < icount; i++) {
                        if (vsettingsData.Languages[i].Id === self.currentLocaleId) {
                            vsettings.Language = {
                                Id: vsettingsData.Languages[i].Id,
                                Code: vsettingsData.Languages[i].Code,
                                Name: vsettingsData.Languages[i].Name
                            };
                            isReloadForce = true;
                            break;
                        }
                    }
                }
                if (isReloadForce) {
                    var accountService = new acc.Services.AccountService();
                    accountService.SettingsData(self.currentLocaleId, vars._appData.Settings === null, function (responseData) {
                        if (responseData.Result === 0) {
                            vsettingsData = responseData.Data;
                            _this.Model.set("SettingsData", vsettingsData);
                            setReload(true, vsettingsData, vsettings);
                            vars._appData.Settings = vsettings;
                        }
                        else {
                            vars._app.ShowError(responseData.Error);
                        }
                        vars._app.HideLoading();
                    });
                }
                else {
                    vars._appData.Settings = vsettings;
                    vars._app.HideLoading();
                    location.reload();
                }
            };
            Main.prototype.basketButtonClick = function (e) {
                return this.handleMenuItem(e, "basket/index");
            };
            Main.prototype.menuSearchButtonClick = function (e) {
                return this.handleMenuItem(e, "search/index");
            };
            Main.prototype.menuAboutButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/index", "label$aboutUs");
            };
            Main.prototype.menuNewsButtonClick = function (e) {
                return this.handleMenuItem(e, "news/index");
            };
            Main.prototype.menuFaqButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/faq", "label$faq");
            };
            Main.prototype.menuShippingButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/shipping", "label$shipping");
            };
            Main.prototype.menuPaymentButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/payment", "label$payment");
            };
            Main.prototype.menuContactButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/contact", "label$contacts");
            };
            Main.prototype.menuSettingsButtonClick = function (e) {
                this.openSettings();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.cmsButtonClick = function (e) {
                return this.handleMenuItem(e, "cms/index");
            };
            Main.prototype.fContactButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/contact", "label$contacts");
            };
            Main.prototype.fFaqButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/faq", "label$faq");
            };
            Main.prototype.fAskQuestionButtonClick = function (e) {
                this.sideNav.sidenav('close');
                this.OpenRequest();
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            Main.prototype.fAboutButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/index", "label$aboutUs");
            };
            Main.prototype.fPoliciesAboutButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/policies", "label$policies");
            };
            Main.prototype.fTermsAboutButtonClick = function (e) {
                return this.handleMenuItemPage(e, "about/termsconditions", "label$termsconditions");
            };
            Main.prototype.fNewsButtonClick = function (e) {
                return this.handleMenuItem(e, "news/index");
            };
            Main.prototype.userProfileButtonClick = function (e) {
                return this.handleMenuItem(e, "account/profile");
            };
            Main.prototype.userMessagesButtonClick = function (e) {
                return this.handleMenuItem(e, "account/messages");
            };
            Main.prototype.userOrdersButtonClick = function (e) {
                return this.handleMenuItem(e, "account/orders");
            };
            Main.prototype.handleMenuItemPage = function (e, urlController, pageEditItemHeader) {
                vars._appData.PageEditItemHeader = pageEditItemHeader;
                return this.handleMenuItem(e, urlController);
            };
            Main.prototype.handleMenuItem = function (e, urlController) {
                this.sideNav.sidenav('close');
                if (!utils.isNullOrEmpty(urlController))
                    variables_1._app.OpenController({ urlController: urlController });
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            return Main;
        }(ctrl.Controller.BaseContent));
        Controller.Main = Main;
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=main.js.map