define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    var App;
    (function (App) {
        class Application {
            constructor() {
                this.contentModals = [];
                vars._app = this;
                this._controllersStack = new base.Controller.ControllersStack();
                this._controllersModalStack = new base.Controller.ControllersStack();
                this._model = this.CreateModel();
                this.Initailize();
            }
            CreateModel() {
                return new kendo.data.ObservableObject({});
            }
            get Model() {
                return this._model;
            }
            get Controller() {
                return this._controller;
            }
            GlobalAjaxSetup() {
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    //jqXHR.setRequestHeader("X-Application-Language", _config.Language);
                    if (vars._identity && vars._identity.Auth && vars._identity.Token) {
                        jqXHR.setRequestHeader("Authorization", "APS-ApiKey " + vars._identity.Token);
                    }
                });
                // $(document).ajaxError(this.GlobalAjaxErrorHandler);
            }
            Initailize() {
                let app = this;
                app.GlobalAjaxSetup();
                app.SetControlNavigation(this);
                app.Resize = $.proxy(app.resize, app);
                app.ControllerBack = $.proxy(app.controllerBack, app);
                app.loadAppView();
            }
            resize(e) {
                let heigth = window.innerHeight;
                heigth = heigth - (this.navbarControl ? this.navbarControl.height() : 0);
                if (this.contentControl)
                    this.contentControl.height(heigth);
                if (this._controller)
                    this._controller.ViewResize(e);
            }
            ShowLoading() {
                if (this.contentControl)
                    this.contentControl.hide();
            }
            HideLoading() {
                if (this.IsModal)
                    this.contentModals[this.contentModals.length - 1].show();
                else if (this.contentControl) {
                    this.contentControl.show();
                }
                this.resize({});
            }
            loadAppView() {
            }
            SetControlNavigation(controlNavigation) {
                if (controlNavigation)
                    this._controllerNavigation = controlNavigation;
            }
            get Uid() {
                let uid = localStorage.getItem('apsUID');
                if (!uid) {
                    uid = M.guid();
                    localStorage.setItem('apsUID', uid);
                }
                return uid;
            }
            get Identity() {
                return this._identity;
            }
            set Identity(identity) {
                this._identity = identity;
            }
            OpenViewTemplateIsModal() {
            }
            SetHeader(controller) {
            }
            OpenViewTemplate(options) {
                let self = this;
                let isInit = false;
                let isModal = (options.isModal ? options.isModal === true : false);
                let isRestore = (options.isRestore ? options.isRestore === true : false);
                let content = self.contentControl;
                try {
                    if (!isModal && self._controller)
                        self._controller.ViewHide(self);
                    if (isModal === true && self.IsModal === false)
                        self._controllersStack.Push(self._controller);
                    self._controller = options.controller;
                    if (isModal === false && isRestore === false)
                        self._controllersStack.Push(options.backController);
                    if (!isModal)
                        self.SetHeader(self._controller);
                    let view = $(options.template);
                    isInit = self._controller.ViewInit(view);
                    if (isModal) {
                        self.OpenViewTemplateIsModal();
                        if (self.IsModal)
                            self._controllersModalStack.Last.View.parent().hide();
                        content = $('<div class="main-view-content-modal"></div>');
                        content.height(self.contentControl.height());
                        self.contentModals.push(content);
                        self.contentControl.hide();
                        self.contentControl.parent().append(content);
                        self._controllersModalStack.Push(self._controller);
                    }
                    else
                        self.ResetScroll();
                    content.html(view[0]);
                    isInit = self._controller.ViewShow(this) && isInit;
                    //if (isInit == false)
                    //    self._controller.ViewResize({});
                }
                finally {
                    if (isInit == true)
                        self.HideLoading();
                }
            }
            get IsModal() {
                return (this.contentModals.length > 0);
            }
            get IsNativeApp() {
                return (window.location.href.toLocaleLowerCase().indexOf('isnativeapp') > -1 ? true : false);
            }
            NativeCommand(command, data) {
                if (this.IsNativeApp)
                    nativeBridge.command(command, JSON.stringify(data));
            }
            ControllerBackEndModal() {
            }
            controllerBack(e) {
                if (this.IsModal === true) {
                    let contentModal = this.contentModals.pop();
                    let controllerModal = this._controllersModalStack.Last;
                    controllerModal.ViewHide(this);
                    contentModal.remove();
                    this._controllersModalStack.Pop();
                    if (this.IsModal === true)
                        this._controllersModalStack.Last.View.parent().show();
                    else {
                        this.ControllerBackEndModal();
                        this._controllersStack.Pop();
                        this._controller = this._controllersStack.Current;
                        this.contentControl.show();
                        this._controller.ViewResize({});
                    }
                    return;
                }
                else {
                    if (this._controllerNavigation === this) {
                        this._controllersStack.Pop();
                        this.RestoreController();
                    }
                    else
                        this._controllerNavigation.ControllerBack(e);
                }
            }
            RestoreController() {
                if (this._controllerNavigation === this) {
                    if (this._controllersStack.Current)
                        this.OpenView({ controller: this._controllersStack.Current });
                }
                else
                    this._controllerNavigation.RestoreController();
            }
            OpenController(options) {
                var self = this;
                let url = "/app/controller/" + options.urlController + ".js";
                require([url], function (module) {
                    let ctrlCreate = vars._controllers[options.urlController];
                    if (ctrlCreate) {
                        let controller = ctrlCreate(module);
                        if (options.onLoadController)
                            options.onLoadController(controller);
                        self.OpenView({ controller: controller, isModal: options.isModal, backController: options.backController });
                    }
                });
            }
            OpenView(options) {
                let self = this;
                if (options.isModal && options.isModal === true) {
                    $.when($.ajax({ url: options.controller.Options.Url, cache: false })).done((template) => {
                        self.OpenViewTemplate({ controller: options.controller, isModal: options.isModal, template: template, backController: options.backController, isRestore: options.isRestore });
                    }).fail((e) => {
                        self.HideLoading();
                    });
                    return;
                }
                if (self._controllerNavigation !== self) {
                    self._controllerNavigation.OpenView(options);
                    return;
                }
                if ($("#" + options.controller.Options.Id).length > 0)
                    return; //Already loaded and current
                self.ShowLoading();
                //<div id="main-view-content-modal" style="display:none"></div>
                $.when($.ajax({ url: options.controller.Options.Url, cache: false })).done((template) => {
                    self.OpenViewTemplate({ controller: options.controller, isModal: options.isModal, template: template, backController: options.backController, isRestore: options.isRestore });
                }).fail((e) => {
                    self.HideLoading();
                });
            }
            ResetScroll() {
                this.contentControl.scrollTop(0);
            }
            HandleError(e) {
                throw new Error("Method not implemented.");
            }
            ShowError(e) {
                throw new Error("Method not implemented.");
            }
            ShowMessage(header, message, onClose) {
                throw new Error("Method not implemented.");
            }
            getLocale() {
                var locale = localStorage.getItem('locale');
                if (!locale) {
                    locale = "en";
                    localStorage.setItem('locale', locale);
                }
                return locale ? locale : "en";
            }
            changeLocale(newlocale) {
                var locale = this.getLocale();
                if (!locale || locale !== newlocale) {
                    localStorage.setItem('locale', newlocale);
                    //reload the app
                    location.reload();
                }
            }
        }
        App.Application = Application;
    })(App = exports.App || (exports.App = {}));
});
//# sourceMappingURL=baseapplication.js.map