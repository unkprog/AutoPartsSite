import vars = require('app/core/variables');
import ctrl = require('app/core/basecontroller');
import utils = require('app/core/utils');
import { _app, _main } from 'app/core/variables';
import acc = require('app/services/accountservice');
import srh = require('app/services/searchservice');

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

        private menuSettings: JQuery;
        private menuCountry: JQuery;
        private menuLang: JQuery;
        private menuCurrency: JQuery;
        private menuAskRequest: JQuery;

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
            this.sideNavBarRight.append(this.menuSettings)/*.append(this.menuCountry).append(this.menuLang).append(this.menuCurrency)*/.append(this.menuBasket);
            this.menuBasket.find('.app-basket-counter').hide();

            this.menuAskRequest = $('<li id="app-btn-askrequest"><a><i class="material-icons">contact_support</i></a></li>');
            this.sideNavBarRight.append(this.menuAskRequest);

            this.buttonMenu = this.menu.find("#app-btn-menu");
            this.content = view.find("#main-view-content");
            this.contentModal = view.find("#main-view-content-modal");
            this.foother = view.find("#main-view-footer");
            super.ViewInit(view);

            this.Model.set('labelUserName', (vars._appData.Identity.Auth === true ? vars._appData.Identity.User.Email : ""));
            this.initLogIn();

           

            let startupPage = localStorage.getItem('startupPage');
            localStorage.removeItem('startupPage');
            if (utils.isNullOrEmpty(startupPage))
                _app.OpenController({ urlController: "search/index" });
            else {
                _app.OpenController({ urlController: startupPage });
            }
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
                utils.destroyClickEvent("app-user-logout", this.LogoutClick);
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
            //this.menuLang.find('#app-btn-lang').dropdown({ constrainWidth: false });
            
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
            self.AppTitleLogoClick = utils.createClickEvent($("#app-title-logo"), self.appTitleLogoClick, self);

            self.OpenMenuButtonClick = self.createTouchClickEvent(self.buttonMenu, self.openMenuButtonClick);

            self.MenuSettingsClick = utils.createClickEvent(self.menuSettings, self.menuSettingsClick, self);
            let el = self.View.find('#app-askquestion-send-btn');
            self.SendAskRequestButtonClick = utils.createClickEvent(el, self.sendAskRequestButtonClick, self);
            
            el = self.View.find('#app-askquestion-send-btn-cancel');
            self.SendAskRequestCancelButtonClick = utils.createClickEvent(el, self.sendAskRequestCancelButtonClick, self);

            self.MenuCountryClick = utils.createClickEvent($("#app-btn-country"), self.menuCountryClick, self);
            self.MenuLangClick = utils.createClickEvent($("#app-btn-lang"), self.menuLangClick, self);
            self.MenuCurrencyClick = utils.createClickEvent($("#app-btn-currency"), self.menuCurrencyClick, self);
            self.MenuAskQuestionClick = utils.createClickEvent(self.menuAskRequest, self.fAskQuestionButtonClick, self);

            //self.LangEnClick = self.createClickEvent("app-lang-en", self.langEnClick);
            //self.LangRuClick = self.createClickEvent("app-lang-ru", self.langRuClick);

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
            //self.UserGarageButtonClick = self.createClickEvent("app-user-garage", self.userGarageButtonClick);
            self.UserMessagesButtonClick = self.createClickEvent("app-user-messages", self.userMessagesButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.buttonMenu, this.OpenMenuButtonClick);

            utils.destroyClickEvent(this.View.find('#app-askquestion-send-btn'), this.SendAskRequestButtonClick);
            utils.destroyClickEvent(this.View.find('#app-askquestion-send-btn-cancel'), this.SendAskRequestCancelButtonClick);
            utils.destroyClickEvent(this.menuSettings, this.MenuSettingsClick);
            utils.destroyClickEvent($("#app-btn-currency"), this.MenuCurrencyClick);
            utils.destroyClickEvent($("#app-btn-lang"), this.MenuLangClick);
            utils.destroyClickEvent($("#app-btn-country"), this.MenuCountryClick);

            //this.destroyClickEvent("app-lang-en", this.LangEnClick);
            //this.destroyClickEvent("app-lang-ru", this.LangRuClick);

            this.destroyClickEvent("app-settings-modal-btn-save", this.AppSettingsSaveButtonClick);
            //utils.destroyClickEvent("app-btn-basket", this.BasketButtonClick, this.View);
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
            //this.destroyClickEvent("app-user-garage", this.UserGarageButtonClick);
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

        public AppTitleLogoClick: { (e: any): void; };
        private appTitleLogoClick(e) {
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
        /*****************************************************/
        /*  BEGIN REQUEST                                    */
        /*****************************************************/
        private appRequestModal: JQuery;
        public OpenRequest() {
            if (vars._appData.Identity && vars._appData.Identity.User && vars._appData.Identity.User.Email && !utils.isNullOrEmpty(vars._appData.Identity.User.Email))
                this.Model.set("AskQuestion.Email", vars._appData.Identity.User.Email);

            let artikle = localStorage.getItem("artikle");
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
        }

        public AskRequestButtonClick: { (e: any): void; };
        public AskRequestButtonClick2: { (e: any): void; };
        private askRequestButtonClick(e) {
            this.OpenRequest();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public SendAskRequestButtonClick: { (e: any): void; };
        private sendAskRequestButtonClick(e) {
            let question: Interfaces.Model.IAskQuestion = this.Model.get("AskQuestion").toJSON();
            if (this.validateQuestion(question)) {
                vars._app.ShowLoading(false);

                let self = this;
                let searchService = new srh.Services.SearchService();
                searchService.SendAskQuestion(question, (responseData) => {
                    if (responseData.Result === 0) {
                        self.appRequestModal.modal('close');
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
        }
        public SendAskRequestCancelButtonClick: { (e: any): void; };
        private sendAskRequestCancelButtonClick(e) {
            this.appRequestModal.modal('close');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        private validateQuestion(model: Interfaces.Model.IAskQuestion): boolean {
            let result: boolean = true;

            if (!utils.validateEmail(model.Email)) {
                M.toast({ html: vars._statres("msg$error$emailIncorrect") });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Question)) {
                M.toast({ html: vars._statres("label$ask$question$incorrect") });
                result = false;
            }

            return result;
        }
        /*****************************************************/
        /*  END REQUEST                                      */
        /*****************************************************/
        /*****************************************************/
        /*  BEGIN SETTINGS                                   */
        /*****************************************************/
        public MenuSettingsClick: { (e: any): void; };
        private menuSettingsClick(e) {
            this.openSettings();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public MenuCountryClick: { (e: any): void; };
        private menuCountryClick(e) {
            this.openSettings();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }


        public MenuLangClick: { (e: any): void; };
        private menuLangClick(e) {
            this.openSettings();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        public MenuCurrencyClick: { (e: any): void; };
        private menuCurrencyClick(e) {
            this.openSettings();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

       
        private setCountryQ: JQuery;
        private setLangQ: JQuery;
        private setCurrencyQ: JQuery;

        private saveLocaleId: number;
        private saveCurrencyId: number;
        private saveCountryId: number;
        private currentLocaleId: number;
        private currentCurrencyId: number;
        private currentCountryId: number;
        private openSettings() {
            let self = this;
            self.sideNav.sidenav('close');
            self.saveLocaleId = vars._appData.Locale && vars._appData.Locale.Id ? vars._appData.Locale.Id : 0;
            self.saveCurrencyId = vars._appData.Settings && vars._appData.Settings.Currency && vars._appData.Settings.Currency.Id ? vars._appData.Settings.Currency.Id : 0;
            self.saveCountryId = vars._appData.Settings && vars._appData.Settings.Country && vars._appData.Settings.Country.Id ? vars._appData.Settings.Country.Id : 0;
            self.currentLocaleId = self.saveLocaleId;
            self.currentCurrencyId = self.saveCurrencyId;
            self.currentCountryId = self.saveCountryId;
            self.openSettingsWithLocale(self.saveLocaleId);
        }

        private openSettingsWithLocale(localeId:number) {
            let self = this;
            vars._app.ShowLoading(true);
            let accountService = new acc.Services.AccountService();
            accountService.SettingsData(localeId, vars._appData.Settings === null, (responseData) => {
                if (responseData.Result === 0) {
                    self.Model.set("SettingsData", responseData.Data);
                    self.setupLists();
                }
                else {
                    vars._app.ShowError(responseData.Error);
                }
                vars._app.HideLoading();
            });
        }

        //private currentLocaleId: number;
      

        private setupLists(): void {
            let self = this;
            let settingsData: Interfaces.Model.ISettingsData = self.Model.get("SettingsData");
            let settings: Interfaces.Model.ISettings = vars._appData.Settings;
            if (settings == null)
                settings = settingsData.Current;

            let setSelectClass = function (sj: JQuery, cls: string): JQuery {
                let el: any = sj[0];
                let elJq: any = $(el.M_FormSelect.dropdown.dropdownEl);
                if (elJq.hasClass(cls) == false)
                    elJq.addClass(cls);
                return sj;
            }
            let html: string = '';
            for (let i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                html = html + '<option value="' + settingsData.Countries[i].Id + '" ' + (self.currentCountryId == settingsData.Countries[i].Id ? 'selected' : '') + '>';
                html = html + /*settingsData.Countries[i].Code + ' - ' +*/ settingsData.Countries[i].Name + '</option>';
            }
            self.setCountryQ = $('#app-settings-modal-list-country').html(html).formSelect();
            setSelectClass(self.setCountryQ, 'select-max-height-650');

            html = '';
            for (let i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                html = html + '<option value="' + settingsData.Languages[i].Id + '" ' + (self.currentLocaleId == settingsData.Languages[i].Id ? 'selected' : '') + '>';
                html = html + /*settingsData.Languages[i].Code + ' - ' +*/ settingsData.Languages[i].Name + '</option>';
            }

            self.setLangQ = $('#app-settings-modal-list-lang').html(html).formSelect();
            setSelectClass(self.setLangQ, 'select-max-height-450');

            let changeLangQ = function (e) {
                self.setLangQ.off('change');
                self.currentLocaleId = parseInt(self.setLangQ.val() as string, 0);
                self.currentCurrencyId = parseInt(self.setCurrencyQ.val() as string, 0);
                self.currentCountryId = parseInt(self.setCountryQ.val() as string, 0);

                M.FormSelect.getInstance(self.setCountryQ[0]).destroy();
                M.FormSelect.getInstance(self.setLangQ[0]).destroy();
                M.FormSelect.getInstance(self.setCurrencyQ[0]).destroy();
                self.openSettingsWithLocale(self.currentLocaleId);
            };

            self.setLangQ.on('change', changeLangQ);

            html = '';
            for (let i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                html = html + '<option value="' + settingsData.Currencies[i].Id + '" ' + (self.currentCurrencyId == settingsData.Currencies[i].Id ? 'selected' : '') + '>';
                html = html + /*settingsData.Currencies[i].Code + ' - ' +*/ settingsData.Currencies[i].Name + '</option>';
            }
            self.setCurrencyQ = $('#app-settings-modal-list-currency').html(html).formSelect();
            setSelectClass(self.setCurrencyQ, 'select-max-height-300');

            if (!this.appSettingsModal)
                this.appSettingsModal = $('#app-settings-modal').modal();
            this.appSettingsModal.modal('open');

        }
        private appSettingsModal: JQuery;

        public AppSettingsSaveButtonClick: { (e: any): void; };
        private appSettingsSaveButtonClick(e: any): boolean {
            this.saveSettingsData();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        private saveSettingsData(): void {
            let self = this;
            let vsettingsData: Interfaces.Model.ISettingsData = this.Model.get("SettingsData");
            let vsettings: Interfaces.Model.ISettings = vars._appData.Settings;

            self.currentLocaleId = parseInt(self.setLangQ.val() as string, 0);
            self.currentCurrencyId = parseInt(self.setCurrencyQ.val() as string, 0);
            self.currentCountryId = parseInt(self.setCountryQ.val() as string, 0);

            this.appSettingsModal.modal('close');
            vars._app.ShowLoading(true);

            let setReload = function (isForce: boolean, settingsData: Interfaces.Model.ISettingsData, settings: Interfaces.Model.ISettings) {
                if (isForce == true || self.currentCountryId !== self.saveCountryId) {
                    for (let i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                        if (settingsData.Countries[i].Id === self.currentCountryId) {
                        settings.Country = {
                            Id: settingsData.Countries[i].Id,
                            Code: settingsData.Countries[i].Code,
                            Name: settingsData.Countries[i].Name
                        }
                        $("#app-btn-country").html(settings.Country.Code);
                        break;

                    }
                }
                }

                if (isForce == true || self.currentCurrencyId !== self.saveCurrencyId) {
                    for (let i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
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
            }

            setReload(false, vsettingsData, vsettings);

            let isReloadForce: boolean = false;
            if (self.currentLocaleId !== self.saveLocaleId) {
                for (let i = 0, icount = vsettingsData.Languages.length; i < icount; i++) {
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
                let accountService = new acc.Services.AccountService();
                accountService.SettingsData(self.currentLocaleId, vars._appData.Settings === null, (responseData) => {
                    if (responseData.Result === 0) {
                        vsettingsData = responseData.Data;
                        this.Model.set("SettingsData", vsettingsData);
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
        }

        /*****************************************************/
        /*  END SETTINGS                                     */
        /*****************************************************/

        //public LangEnClick: { (e: any): void; };
        //private langEnClick(e) {
        //    vars._appData.Locale = "en";//            vars._app.changeLocale("en");
        //    location.reload();
        //    e.preventDefault();
        //    return false;
        //}

        //public LangRuClick: { (e: any): void; };
        //private langRuClick(e) {
        //    vars._appData.Locale = "ru";//            vars._app.changeLocale("ru");
        //    location.reload();
        //    e.preventDefault();
        //    return false;
        //}

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
            this.openSettings();
            e.preventDefault();
            e.stopPropagation();
            return false;
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

        public FAskQuestionButtonClick: { (e: any): void; };
        public MenuAskQuestionClick: { (e: any): void; };
        public MenuAskQuestionClick2: { (e: any): void; };
        private fAskQuestionButtonClick(e: any): boolean {
            this.sideNav.sidenav('close');
            this.OpenRequest();
            e.preventDefault();
            e.stopPropagation();
            return false;
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


        public UserProfileButtonClick: { (e: any): void; };
        private userProfileButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/profile");
        }

        public UserMessagesButtonClick: { (e: any): void; };
        private userMessagesButtonClick(e: any): boolean {
            return this.handleMenuItem(e, "account/messages");
        }

        //public UserGarageButtonClick: { (e: any): void; };
        //private userGarageButtonClick(e: any): boolean {
        //    return this.handleMenuItem(e, "account/garage");
        //}

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