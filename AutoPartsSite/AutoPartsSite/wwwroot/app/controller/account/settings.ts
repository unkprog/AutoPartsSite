import vars = require('app/core/variables');
import utils = require('app/core/utils');
import acc = require('app/controller/account/account');

export namespace Controller.Account {
    export class Settings extends acc.Controller.Account.Account {

        constructor() {
            super();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/account/settings.html", Id: "settings-view" };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$settings"),
                "labelShippingDestination": vars._statres("label$shipping$destination"),
                "labelLanguage": vars._statres("label$language"),
                "labelCurrency": vars._statres("label$currency"),
                "labelSave": vars._statres("button$label$save"),
                "labelCancel": vars._statres("button$label$cancel"),
                "SettingsData": { "Countries": [], "Languages": [], "Currencies": [] },
                "Settings": null
            });
        }

       
        public ViewShow(e: any): boolean {
            super.ViewShow(e);
            this.loadSettingsData();
            return false;
        }

        protected createEvents(): void {
            this.SaveButtonClick = this.createClickEvent("settings-view-btn-save", this.saveButtonClick);
            //this.CancelButtonClick = this.createClickEvent("settings-view-btn-cancel", this.cancelButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyClickEvent("settings-view-btn-save", this.SaveButtonClick);
            //this.destroyClickEvent("settings-view-btn-cancel", this.CancelButtonClick);
        }

        public SaveButtonClick: { (e: any): void; };
        private saveButtonClick(e: any): boolean {
            this.saveSettingsData();
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        //public CancelButtonClick: { (e: any): void; };
        //private cancelButtonClick(e: any): boolean {
        //    vars._main.ControllerBack(this);
        //    e.preventDefault();
        //    e.stopPropagation();
        //    return false;
        //}

        private loadSettingsData(): void {
            let self = this;
            vars._app.ShowLoading();
            self.AccountService.SettingsData(vars._appData.Locale, vars._appData.Settings === null, (responseData) => {
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

        private setupLists():void {
            let settingsData: Interfaces.Model.ISettingsData = this.Model.get("SettingsData");
            let settings: Interfaces.Model.ISettings = vars._appData.Settings;
            if (settings == null)
                settings = settingsData.Current;

            let html: string = '';
            for (let i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                html = html + '<option value="' + settingsData.Countries[i].Id + '" ' + (settings.Country.Code.toLowerCase() == settingsData.Countries[i].Code.toLowerCase() ? 'selected' : '') + '>';
                html = html + settingsData.Countries[i].Code + ' - ' + settingsData.Countries[i].Name + '</option>';
            }
            $('#settings-view-list-country').html(html);

            html = '';
            for (let i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                html = html + '<option value="' + settingsData.Languages[i].Id + '" ' + (settings.Language.Code.toLowerCase() == settingsData.Languages[i].Code.toLowerCase() ? 'selected' : '') + '>';
                html = html + settingsData.Languages[i].Code + ' - ' + settingsData.Languages[i].Name + '</option>';
            }
            $('#settings-view-list-lang').html(html);

            html = '';
            for (let i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                html = html + '<option value="' + settingsData.Currencies[i].Id + '" ' + (settings.Currency.Code.toLowerCase() == settingsData.Currencies[i].Code.toLowerCase() ? 'selected' : '') + '>';
                html = html + settingsData.Currencies[i].Code + ' - ' + settingsData.Currencies[i].Name + '</option>';
            }
            $('#settings-view-list-currency').html(html);

            this.View.find('select').formSelect();
        }

        private saveSettingsData(): void {
            let settingsData: Interfaces.Model.ISettingsData = this.Model.get("SettingsData");
            let settings: Interfaces.Model.ISettings = vars._appData.Settings;
            let country: number = parseInt($('#settings-view-list-country').val() as string, 0);
            let lang: number = parseInt($('#settings-view-list-lang').val() as string, 0);
            let currency: number = parseInt($('#settings-view-list-currency').val() as string, 0);

            if (settings.Country.Id !== country) {
                for (let i = 0, icount = settingsData.Countries.length; i < icount; i++) {
                    if (settingsData.Countries[i].Id === country) {
                        settings.Country = {
                            Id: settingsData.Countries[i].Id,
                            Code: settingsData.Countries[i].Code,
                            Name: settingsData.Countries[i].Name
                        }
                        break;

                    }
                }
            }

            if (settings.Currency.Id !== currency) {
                for (let i = 0, icount = settingsData.Currencies.length; i < icount; i++) {
                    if (settingsData.Currencies[i].Id === currency) {
                        settings.Currency = {
                            Id: settingsData.Currencies[i].Id,
                            Code: settingsData.Currencies[i].Code,
                            Name: settingsData.Currencies[i].Name
                        };
                        break;
                    }
                }
            }

            if (settings.Language.Id !== lang) {
                for (let i = 0, icount = settingsData.Languages.length; i < icount; i++) {
                    if (settingsData.Languages[i].Id === lang) {
                        settings.Language = {
                            Id: settingsData.Languages[i].Id,
                            Code: settingsData.Languages[i].Code,
                            Name: settingsData.Languages[i].Name
                        };
                        break;
                    }
                }
            }
            vars._appData.Settings = settings;
            vars._app.OpenController({ urlController: "search/index" });
        }
    }
}

vars.registerController("account/settings", function (module: any): Interfaces.IController { return new module.Controller.Account.Settings(); });