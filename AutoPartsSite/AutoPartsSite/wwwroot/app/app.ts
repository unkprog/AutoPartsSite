﻿import utils = require('app/core/utils');
import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import baseapp = require('app/core/baseapplication');
import acc = require('app/services/accountservice');
import nvbr = require('app/services/nativebridgeservice');

export module App {
    export class Application extends baseapp.App.Application {

        constructor() {
            super();
        }

        protected CreateModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "AppHeader": vars._statres("label$AutoPartsSite"),
                "labelOk": vars._statres("button$label$ok"),
                "labelError": vars._statres("label$error"),
                "contentError": ""
            });
        }

        private progressControl: JQuery;
        private rigthMenuItems: JQuery;
        private buttonAppClose: JQuery;
        private appTitle: JQuery;

        public Initailize(): void {
            super.Initailize();

            let app = this;
            app.progressControl = $("#progress-container");
            app.contentControl = $("#app-content");
            app.appTitle = $("#app-title");
            window.nativeBridge = new nvbr.Services.NativeBridgeService()
           
        }

        public ShowLoading(isScrollReset: boolean = true) {
            this.progressControl.show();
            super.ShowLoading(isScrollReset);
        }

        public HideLoading() {
            this.progressControl.hide();
            super.HideLoading();
        }

        protected loadAppView() {
            let self = this;
            let accountService: acc.Services.AccountService = new acc.Services.AccountService();

            accountService.Uid((responseData) => {
                vars._appData.Identity = responseData.Data.Identity;
                vars._appData.Version = responseData.Data.Version;
                let settings: Interfaces.Model.ISettings = vars._appData.Settings;
                if (settings != null)
                    self.loadAppView_();
                else {

                    accountService.Settings((responseData) => {
                        if (responseData.Result === 0) {
                            vars._appData.Settings = responseData.Data;
                            self.loadAppView_();
                        }
                        else {
                            alert(responseData.Error);
                        }
                    });
                }

            });
        }

        private loadAppView_() {
            let self = this;
            $.when($.ajax({ url: "/app/app.html"/*, cache: false*/ })).done((template) => {
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

                } finally {

                }
            }).fail((e) => {
                self.HideLoading();
                alert(e.responseText);
            });
        }

        private CloseApp(e): void {
            this.NativeCommand("CloseApp", {});
        }

        protected SetHeader(controller: Interfaces.IController) {
            let header = controller.Header;
            if (header)
                this.Model.set("AppHeader", header); // + ' ' + self.contentControl.width()
            else
                if (vars._statres("label$AutoPartsSite") !== this.Model.get("AppHeader"))
                    this.Model.set("AppHeader", vars._statres("label$AutoPartsSite"));
        }

        protected OpenViewTemplateIsModal() {
            if ($("#app-btn-menu").hasClass("hide") == false)
                $("#app-btn-menu").addClass("hide");
        }

        protected ControllerBackEndModal() {
            $("#app-btn-menu").removeClass("hide");
        }

        private login(): void {
            
        }

        private initAfterLoaded() {
            this.OpenController({ urlController: "main" });
        }

        public HandleError(e: any): void {
            this.ShowError(e.responseJSON ? (e.responseJSON.error ? e.responseJSON.error : (e.responseJSON.Message ? e.responseJSON.Message : e)) : e);
        }

        public ShowError(e: string): void {
            this.ShowMessage(vars._statres("label$error"), e);
        }

        public ShowMessage(header: string, message: string, onClose?: () => void): void {
            require(['app/controller/dialog/modaldialog'], function (dialog) {
                let messagerDialog: Interfaces.IDialog = new dialog.Controller.Dialog.ModalDialog();
                messagerDialog.OnClose = onClose;
                messagerDialog.Show(header, message);
                vars._app.HideLoading();
            });
        }


    }
}