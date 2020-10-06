define(["require", "exports", "app/core/utils", "app/core/variables", "app/core/baseapplication"], function (require, exports, utils, vars, baseapp) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    var App;
    (function (App) {
        class Application extends baseapp.App.Application {
            constructor() {
                super();
            }
            CreateModel() {
                return new kendo.data.ObservableObject({
                    "AppHeader": vars._statres("label$AutoPartsSite"),
                    "labelOk": vars._statres("button$label$ok"),
                    "labelError": vars._statres("label$error"),
                    "contentError": ""
                });
            }
            Initailize() {
                super.Initailize();
                let app = this;
                app.progressControl = $("#progress-container");
                app.contentControl = $("#app-content");
                app.appTitle = $("#app-title");
            }
            ShowLoading() {
                this.progressControl.show();
                super.ShowLoading();
            }
            HideLoading() {
                this.progressControl.hide();
                super.HideLoading();
            }
            loadAppView() {
                let self = this;
                $.when($.ajax({ url: "/app/app.html", cache: false })).done((template) => {
                    try {
                        $("#app-view").html(template);
                        kendo.bind($("#app-view"), self.Model);
                        self.contentControl = $("#app-content");
                        self.navbarControl = $("#app-navbar");
                        self.rigthMenuItems = $("#rigthMenuItems");
                        if (self.IsNativeApp == true) {
                            self.buttonAppClose = $('<li><a id="app-btn-close" class="tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$close") + '"><i class="material-icons">close</i></a></li>');
                            self.rigthMenuItems.append(self.buttonAppClose);
                            utils.createClickEvent(self.buttonAppClose, self.CloseApp, self);
                        }
                        self.resize(undefined);
                        self.initAfterLoaded();
                    }
                    finally {
                    }
                }).fail((e) => {
                    self.HideLoading();
                    alert(e.responseText);
                });
            }
            CloseApp(e) {
                this.NativeCommand("CloseApp", {});
            }
            SetHeader(controller) {
                let header = controller.Header;
                if (header)
                    this.Model.set("AppHeader", header); // + ' ' + self.contentControl.width()
                else if (vars._statres("label$AutoPartsSite") !== this.Model.get("AppHeader"))
                    this.Model.set("AppHeader", vars._statres("label$AutoPartsSite"));
            }
            OpenViewTemplateIsModal() {
                if ($("#app-btn-menu").hasClass("hide") == false)
                    $("#app-btn-menu").addClass("hide");
            }
            ControllerBackEndModal() {
                $("#app-btn-menu").removeClass("hide");
            }
            login() {
            }
            initAfterLoaded() {
                this.OpenController({ urlController: "main" });
            }
            HandleError(e) {
                this.ShowError(e.responseJSON ? (e.responseJSON.error ? e.responseJSON.error : (e.responseJSON.Message ? e.responseJSON.Message : e)) : e);
            }
            ShowError(e) {
                this.ShowMessage(vars._statres("label$error"), e);
            }
            ShowMessage(header, message, onClose) {
                require(['app/controller/dialog/modaldialog'], function (dialog) {
                    let messagerDialog = new dialog.Controller.Dialog.ModalDialog();
                    messagerDialog.OnClose = onClose;
                    messagerDialog.Show(header, message);
                    vars._app.HideLoading();
                });
            }
            ChangeLocale(newlocale) {
                var locale = localStorage.getItem('locale');
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
//# sourceMappingURL=app.js.map