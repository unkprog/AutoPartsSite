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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/core/utils", "app/core/variables", "app/services/accountservice"], function (require, exports, vars, ctrl, utils, variables_1, acc) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Main = /** @class */ (function (_super) {
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
                    "labelCustomerService": vars._statres("label$customer$service"),
                    "labelInformation": vars._statres("label$information"),
                    "labelVersion": "",
                    "SettingsData": { "Countries": [], "Languages": [], "Currencies": [] }
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
                //this.menuLang = $('<li><a id="app-btn-lang" class="dropdown-trigger tooltipped" data-target="app-dropdown-lang-menu" data-position="bottom" data-tooltip="' + vars._statres("label$language") + '"><img class="app-flag-icon" src="/img/flags/' + vars._appData.Locale + '.svg"/></a></li>');
                //this.menuCountry = $('<li><a id="app-btn-country" class="tooltipped modal-trigger" href="#app-settings-modal" data-position="bottom">' + vars._appData.Settings.Country.Code + '</a></li>'); //data-tooltip="' + vars._statres("label$country") + '"
                //this.menuLang = $('<li><a id="app-btn-lang" class="tooltipped modal-trigger" href="#app-settings-modal" data-position="bottom"><img class="app-flag-icon" src="/img/flags/' + vars._appData.Locale.Code.toLowerCase() + '.svg"/></a></li>'); //data-tooltip="' + vars._statres("label$language") + '"
                //this.menuCurrency = $('<li><a id="app-btn-currency" class="tooltipped modal-trigger" href="#app-settings-modal" data-position="bottom">' + vars._appData.Settings.Currency.Code + '</a></li>'); //data-tooltip="' + vars._statres("label$currency") + '"
                this.menuSettings = $('<li><a class="modal-trigger" href="#app-settings-modal"></a></li>');
                this.menuCountry = $('<span id="app-btn-country" style="margin: 0 0.5rem 0 0;">' + vars._appData.Settings.Country.Code + '<span>');
                this.menuLang = $('<img class="app-flag-icon" style="margin-top:-4px;width:1.5rem;height:1.35em;" src="/img/flags/' + vars._appData.Locale.Code.toLowerCase() + '.svg"/>');
                this.menuCurrency = $('<span id="app-btn-currency" style="margin: 0 0 0 0.5rem;">' + vars._appData.Settings.Currency.Code + '<span>');
                this.menuSettings.find('a').append(this.menuCountry).append(this.menuLang).append(this.menuCurrency);
                this.menuBasket = $('<li><a id="app-btn-basket" data-position="bottom"><i class="material-icons">shopping_cart</i></a><div class="center app-basket-counter">0</div></li>'); //class="tooltipped"  data-tooltip="' + vars._statres("label$basket") + '"
                this.sideNavBarRight.append(this.menuSettings) /*.append(this.menuCountry).append(this.menuLang).append(this.menuCurrency)*/.append(this.menuBasket);
                this.menuBasket.find('.app-basket-counter').hide();
                this.buttonMenu = this.menu.find("#app-btn-menu");
                this.content = view.find("#main-view-content");
                this.contentModal = view.find("#main-view-content-modal");
                this.foother = view.find("#main-view-footer");
                _super.prototype.ViewInit.call(this, view);
                this.Model.set('labelUserName', (vars._appData.Identity.Auth === true ? vars._appData.Identity.User.Email : ""));
                this.initLogIn();
                variables_1._app.OpenController({ urlController: "search/index" });
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
                //this.menuLang.find('#app-btn-lang').dropdown({ constrainWidth: false });
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
                //let childsHeight = footerHeight;
                //content.children().each(function () {
                //    childsHeight += $(this).innerHeight();
                //});
                //;
                //if (height < childsHeight)
                //    height = childsHeight;
                ////content.height(height);
                content.css("min-height", height);
            };
            Main.prototype.createEvents = function () {
                var self = this;
                self.AppTitleClick = utils.createClickEvent($("#app-title"), self.appTitleClick, self);
                self.AppTitleLogoClick = utils.createClickEvent($("#app-title-logo"), self.appTitleLogoClick, self);
                self.OpenMenuButtonClick = self.createTouchClickEvent(self.buttonMenu, self.openMenuButtonClick);
                self.MenuSettingsClick = utils.createClickEvent(self.menuSettings, self.menuSettingsClick, self);
                self.MenuCountryClick = utils.createClickEvent($("#app-btn-country"), self.menuCountryClick, self);
                self.MenuLangClick = utils.createClickEvent($("#app-btn-lang"), self.menuLangClick, self);
                self.MenuCurrencyClick = utils.createClickEvent($("#app-btn-currency"), self.menuCurrencyClick, self);
                //self.LangEnClick = self.createClickEvent("app-lang-en", self.langEnClick);
                //self.LangRuClick = self.createClickEvent("app-lang-ru", self.langRuClick);
                self.AppSettingsSaveButtonClick = this.createClickEvent("app-settings-modal-btn-save", self.appSettingsSaveButtonClick);
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
            };
            Main.prototype.destroyEvents = function () {
                this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);
                utils.destroyClickEvent(this.menuSettings, this.MenuSettingsClick);
                utils.destroyClickEvent($("#app-btn-currency"), this.MenuCurrencyClick);
                utils.destroyClickEvent($("#app-btn-lang"), this.MenuLangClick);
                utils.destroyClickEvent($("#app-btn-country"), this.MenuCountryClick);
                //this.destroyClickEvent("app-lang-en", this.LangEnClick);
                //this.destroyClickEvent("app-lang-ru", this.LangRuClick);
                this.destroyClickEvent("app-settings-modal-btn-save", this.AppSettingsSaveButtonClick);
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
                self.currentLocaleId = vars._appData.Locale.Id;
                self.openSettingsWithLocale(self.currentLocaleId);
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
                var countryVal = (settings.Country && settings.Country != null && !utils.isNullOrEmpty(settings.Country.Code) ? settings.Country.Code.toLowerCase() : '');
                ;
                for (var i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                    html = html + '<option value="' + settingsData.Countries[i].Id + '" ' + (countryVal == settingsData.Countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                    html = html + /*settingsData.Countries[i].Code + ' - ' +*/ settingsData.Countries[i].Name + '</option>';
                }
                self.setCountryQ = $('#app-settings-modal-list-country').html(html).formSelect();
                setSelectClass(self.setCountryQ, 'select-max-height-650');
                html = '';
                //let langVal = (settings.Language && settings.Language != null ? settings.Language.Id : 0);
                for (var i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                    html = html + '<option value="' + settingsData.Languages[i].Id + '" ' + (settingsData.Languages[i].Id == self.currentLocaleId ? 'selected' : '') + '>';
                    html = html + /*settingsData.Languages[i].Code + ' - ' +*/ settingsData.Languages[i].Name + '</option>';
                }
                self.setLangQ = $('#app-settings-modal-list-lang').html(html).formSelect();
                setSelectClass(self.setLangQ, 'select-max-height-450');
                var changeLangQ = function (e) {
                    self.currentLocaleId = parseInt($('#app-settings-modal-list-lang').val(), 0);
                    self.setLangQ.off('change');
                    M.FormSelect.getInstance(self.setCountryQ[0]).destroy();
                    M.FormSelect.getInstance(self.setLangQ[0]).destroy();
                    M.FormSelect.getInstance(self.setCurrencyQ[0]).destroy();
                    self.openSettingsWithLocale(self.currentLocaleId);
                };
                self.setLangQ.on('change', changeLangQ);
                html = '';
                var currVal = (settings.Currency && settings.Currency != null && !utils.isNullOrEmpty(settings.Currency.Code) ? settings.Currency.Code.toLowerCase() : '');
                ;
                for (var i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                    html = html + '<option value="' + settingsData.Currencies[i].Id + '" ' + (currVal == settingsData.Currencies[i].Code.toLowerCase() ? 'selected' : '') + '>';
                    html = html + /*settingsData.Currencies[i].Code + ' - ' +*/ settingsData.Currencies[i].Name + '</option>';
                }
                self.setCurrencyQ = $('#app-settings-modal-list-currency').html(html).formSelect();
                setSelectClass(self.setCurrencyQ, 'select-max-height-300');
                //this.View.find('#app-settings-modal-list-country').formSelect({ classes: 'select-max-height-600' })
                //this.View.find('#app-settings-modal-list-lang').formSelect({ classes: 'select-max-height-400' });
                //this.View.find('#app-settings-modal-list-currency').formSelect({ classes: 'select-max-height-400' });
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
                var vsettingsData = this.Model.get("SettingsData");
                var vsettings = vars._appData.Settings;
                var country = parseInt($('#app-settings-modal-list-country').val(), 0);
                var lang = parseInt($('#app-settings-modal-list-lang').val(), 0);
                var currency = parseInt($('#app-settings-modal-list-currency').val(), 0);
                this.appSettingsModal.modal('close');
                vars._app.ShowLoading(true);
                var setReload = function (isForce, settingsData, settings) {
                    if (isForce == true || settings.Country.Id !== country) {
                        for (var i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                            if (settingsData.Countries[i].Id === country) {
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
                    if (isForce == true || settings.Currency.Id !== currency) {
                        for (var i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                            if (settingsData.Currencies[i].Id === currency) {
                                settings.Currency = {
                                    Id: settingsData.Currencies[i].Id,
                                    Code: settingsData.Currencies[i].Code,
                                    Name: settingsData.Currencies[i].Name,
                                    Symbol: settingsData.Currencies[i].Symbol,
                                    ShowLeft: settingsData.Currencies[i].ShowLeft
                                };
                                $("#app-btn-country").html(settings.Currency.Code);
                                break;
                            }
                        }
                    }
                };
                setReload(false, vsettingsData, vsettings);
                var isReloadForce = false;
                if (vsettings.Language.Id !== lang) {
                    for (var i = 0, icount = vsettingsData.Languages.length; i < icount; i++) {
                        if (vsettingsData.Languages[i].Id === lang) {
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
                    accountService.SettingsData(lang, vars._appData.Settings === null, function (responseData) {
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
            Main.prototype.userSettingsButtonClick = function (e) {
                return this.handleMenuItem(e, "account/settings");
            };
            Main.prototype.userMessagesButtonClick = function (e) {
                return this.handleMenuItem(e, "account/messages");
            };
            Main.prototype.userGarageButtonClick = function (e) {
                return this.handleMenuItem(e, "account/garage");
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