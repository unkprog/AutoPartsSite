define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    var App;
    (function (App) {
        var Application = /** @class */ (function () {
            function Application() {
                this.contentModals = [];
                vars._app = this;
                this._controllersStack = new base.Controller.ControllersStack();
                this._controllersModalStack = new base.Controller.ControllersStack();
                this._model = this.CreateModel();
                this.Initailize();
            }
            Application.prototype.CreateModel = function () {
                return new kendo.data.ObservableObject({});
            };
            Object.defineProperty(Application.prototype, "Model", {
                get: function () {
                    return this._model;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "Controller", {
                get: function () {
                    return this._controller;
                },
                enumerable: false,
                configurable: true
            });
            Application.prototype.GlobalAjaxSetup = function () {
                $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                    //jqXHR.setRequestHeader("X-Application-Language", _config.Language);
                    if (vars._appData.Identity && vars._appData.Identity.Auth && vars._appData.Identity.Token) {
                        jqXHR.setRequestHeader("Authorization", "APS-ApiKey " + vars._appData.Identity.Token);
                    }
                });
                // $(document).ajaxError(this.GlobalAjaxErrorHandler);
            };
            Application.prototype.Initailize = function () {
                var app = this;
                app.GlobalAjaxSetup();
                app.SetControlNavigation(this);
                app.Resize = $.proxy(app.resize, app);
                app.ControllerBack = $.proxy(app.controllerBack, app);
                app.loadAppView();
            };
            Application.prototype.resize = function (e) {
                var height = window.innerHeight;
                height = height - (this.navbarControl ? this.navbarControl.innerHeight() : 0);
                if (this.contentControl) {
                    this.contentControl.height(height);
                    //this.contentControl.css("min-height", height);
                    //this.contentControl.css("height", "auto"); //
                }
                if (this._controller)
                    this._controller.ViewResize(e);
            };
            Application.prototype.ShowLoading = function () {
                if (this.contentControl)
                    this.contentControl.hide();
            };
            Application.prototype.HideLoading = function () {
                if (this.IsModal)
                    this.contentModals[this.contentModals.length - 1].show();
                else if (this.contentControl) {
                    this.contentControl.show();
                }
                this.resize({});
            };
            Application.prototype.loadAppView = function () {
            };
            Application.prototype.SetControlNavigation = function (controlNavigation) {
                if (controlNavigation)
                    this._controllerNavigation = controlNavigation;
            };
            Object.defineProperty(Application.prototype, "Identity", {
                get: function () {
                    return this._identity;
                },
                set: function (identity) {
                    this._identity = identity;
                },
                enumerable: false,
                configurable: true
            });
            Application.prototype.OpenViewTemplateIsModal = function () {
            };
            Application.prototype.SetHeader = function (controller) {
            };
            Application.prototype.OpenViewTemplate = function (options) {
                var self = this;
                var isInit = false;
                var isModal = (options.isModal ? options.isModal === true : false);
                var isRestore = (options.isRestore ? options.isRestore === true : false);
                var content = self.contentControl;
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
                    var view = $(options.template);
                    if (view.length > 0) {
                        for (var i = 0, icount = view.length; i < icount; i++) {
                            if (self._controller.Options.Id === view[i].id)
                                view = $(view[i]);
                        }
                    }
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
                    else {
                        self.ResetScroll();
                        content.html(view[0]);
                        isInit = self._controller.ViewShow(self) && isInit;
                        self._controller.ViewResize(self);
                        //content.html(view[0]);
                        //isInit = self._controller.ViewShow(this) && isInit;
                        ////if (isInit == false)
                        ////    self._controller.ViewResize({});
                    }
                }
                finally {
                    if (isInit == true)
                        self.HideLoading();
                }
            };
            Object.defineProperty(Application.prototype, "IsModal", {
                get: function () {
                    return (this.contentModals.length > 0);
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Application.prototype, "IsNativeApp", {
                get: function () {
                    return (window.location.href.toLocaleLowerCase().indexOf('isnativeapp') > -1 ? true : false);
                },
                enumerable: false,
                configurable: true
            });
            Application.prototype.NativeCommand = function (command, data) {
                if (this.IsNativeApp)
                    nativeBridge.command(command, JSON.stringify(data));
            };
            Application.prototype.ControllerBackEndModal = function () {
            };
            Application.prototype.controllerBack = function (e) {
                if (this.IsModal === true) {
                    var contentModal = this.contentModals.pop();
                    var controllerModal = this._controllersModalStack.Last;
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
            };
            Application.prototype.RestoreController = function () {
                if (this._controllerNavigation === this) {
                    if (this._controllersStack.Current)
                        this.OpenView({ controller: this._controllersStack.Current });
                }
                else
                    this._controllerNavigation.RestoreController();
            };
            Application.prototype.OpenController = function (options) {
                var self = this;
                var url = "/app/controller/" + options.urlController + ".js";
                require([url], function (module) {
                    var ctrlCreate = vars._controllers[options.urlController];
                    if (ctrlCreate) {
                        var controller = ctrlCreate(module);
                        if (options.onLoadController)
                            options.onLoadController(controller);
                        self.OpenView({ controller: controller, isModal: options.isModal, backController: options.backController });
                    }
                });
            };
            Application.prototype.OpenView = function (options) {
                var self = this;
                if (options.isModal && options.isModal === true) {
                    $.when($.ajax({ url: options.controller.Options.Url, cache: false })).done(function (template) {
                        self.OpenViewTemplate({ controller: options.controller, isModal: options.isModal, template: template, backController: options.backController, isRestore: options.isRestore });
                    }).fail(function (e) {
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
                $.when($.ajax({ url: options.controller.Options.Url, cache: false })).done(function (template) {
                    self.OpenViewTemplate({ controller: options.controller, isModal: options.isModal, template: template, backController: options.backController, isRestore: options.isRestore });
                }).fail(function (e) {
                    self.HideLoading();
                });
            };
            Application.prototype.ResetScroll = function () {
                this.contentControl.scrollTop(0);
            };
            Application.prototype.HandleError = function (e) {
                throw new Error("Method not implemented.");
            };
            Application.prototype.ShowError = function (e) {
                throw new Error("Method not implemented.");
            };
            Application.prototype.ShowMessage = function (header, message, onClose) {
                throw new Error("Method not implemented.");
            };
            return Application;
        }());
        App.Application = Application;
    })(App = exports.App || (exports.App = {}));
});
//# sourceMappingURL=baseapplication.js.map