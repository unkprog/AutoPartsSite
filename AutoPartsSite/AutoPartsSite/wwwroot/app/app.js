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
define(["require", "exports", "app/core/utils", "app/core/variables", "app/core/baseapplication"], function (require, exports, utils, vars, baseapp) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    var App;
    (function (App) {
        var Application = /** @class */ (function (_super) {
            __extends(Application, _super);
            function Application() {
                return _super.call(this) || this;
            }
            Application.prototype.CreateModel = function () {
                return new kendo.data.ObservableObject({
                    "AppHeader": "Auto Parts Site",
                    "labelOk": vars._statres("button$label$ok"),
                    "labelError": vars._statres("label$error"),
                    "contentError": ""
                });
            };
            Application.prototype.Initailize = function () {
                _super.prototype.Initailize.call(this);
                var app = this;
                app.progressControl = $("#progress-container");
                app.contentControl = $("#app-content");
            };
            Application.prototype.ShowLoading = function () {
                this.progressControl.show();
                _super.prototype.ShowLoading.call(this);
            };
            Application.prototype.HideLoading = function () {
                this.progressControl.hide();
                _super.prototype.HideLoading.call(this);
            };
            Application.prototype.loadAppView = function () {
                var self = this;
                $.when($.ajax({ url: "/Content/view/app.html", cache: false })).done(function (template) {
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
                }).fail(function (e) {
                    self.HideLoading();
                    alert(e.responseText);
                });
            };
            Application.prototype.CloseApp = function (e) {
                this.NativeCommand("CloseApp", {});
            };
            Application.prototype.SetHeader = function (controller) {
                var header = controller.Header;
                if (header)
                    this.Model.set("AppHeader", header); // + ' ' + self.contentControl.width()
                else if ("POS Cloud" !== this.Model.get("AppHeader"))
                    this.Model.set("AppHeader", "POS Cloud");
            };
            Application.prototype.OpenViewTemplateIsModal = function () {
                if ($("#app-btn-menu").hasClass("hide") == false)
                    $("#app-btn-menu").addClass("hide");
            };
            Application.prototype.ControllerBackEndModal = function () {
                $("#app-btn-menu").removeClass("hide");
            };
            Application.prototype.login = function () {
                this.OpenController({ urlController: "security/login" });
            };
            Application.prototype.initAfterLoaded = function () {
                this.login();
            };
            Application.prototype.HandleError = function (e) {
                this.ShowError(e.responseJSON ? (e.responseJSON.error ? e.responseJSON.error : (e.responseJSON.Message ? e.responseJSON.Message : e)) : e);
            };
            Application.prototype.ShowError = function (e) {
                this.ShowMessage(vars._statres("label$error"), e);
            };
            Application.prototype.ShowMessage = function (header, message, onClose) {
                require(['app/controller/dialog/modaldialog'], function (dialog) {
                    var messagerDialog = new dialog.Controller.Dialog.ModalDialog();
                    messagerDialog.OnClose = onClose;
                    messagerDialog.Show(header, message);
                });
            };
            return Application;
        }(baseapp.App.Application));
        App.Application = Application;
    })(App = exports.App || (exports.App = {}));
});
//# sourceMappingURL=app.js.map