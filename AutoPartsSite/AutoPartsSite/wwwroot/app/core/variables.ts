/// <amd-dependency path="i18n!nls/strings" />

import { isNullOrEmpty } from "./utils";

export declare let _app: Interfaces.IApplication;
export declare let _main: Interfaces.IMainNavigation;
export declare let _statres: (id: string) => string;
export declare let _absUrl: (id: string) => string;   //Create absolute ref to resource
export declare let _showError: (error: string) => void;


export declare let _appSettings: {
    IsDebug: boolean;
    Version: string;
    Language: string;
};


export namespace App {
    export class StaticResources {

        private i18nData: any;
        constructor() {
            this.i18nData = require("i18n!nls/strings");
        }

        public GetString(id: string): string {
            return (this.i18nData && this.i18nData[id]) ? this.i18nData[id] : "";
        }
    }
}

const staticResources = new App.StaticResources();
_statres = (id: string) => { return staticResources.GetString(id); }
_showError = (error: string) => { _app.ShowError(error); }

export declare let _controllers: any;
_controllers = {};
_controllers["main"] = function (module: any): Interfaces.IController { return new module.Controller.Main(); };

export function registerController(crtlId: string, funcConstructor: (module: any) => Interfaces.IController): void {
    if (!_controllers[crtlId])
        _controllers[crtlId] = funcConstructor;
}

export function unRegisterController(crtlId: string): void {
    if (_controllers[crtlId])
        delete _controllers[crtlId];
}

export declare let _editorData: any;
_editorData = {};

export declare let _templates: any;
_templates = {};

export function getTemplate(template: string): Function {
    let result: Function;
    let hash: number = window.strToHashCode(template);
    result = _templates[''+hash];
    if (!result) {
        result = kendo.template(template);
        _templates['' + hash] = result;
    }
    return result;
}

export declare let WeekNamesByValue: Array<string>;
WeekNamesByValue = ["", _statres("label$dayweek$sun"), _statres("label$dayweek$mon"), _statres("label$dayweek$tue"), _statres("label$dayweek$wed"), _statres("label$dayweek$thu"), _statres("label$dayweek$fri"), _statres("label$dayweek$sat")];
window.WeekNamesByValue = WeekNamesByValue;


export declare let sumTextColor: string;
export declare let checkTextColor: string;
export declare let positionTextColor: string;
sumTextColor = '#2196f3';
checkTextColor = '#ff9800';
positionTextColor = '#4caf50';


export namespace App {
    export class Data {

        constructor() {
            this._identity = { Auth: false, Cms: false, Token: '', User: null, SiteId: 0 };
        }

        private _identity: Interfaces.Model.IIdentity;
        public get Identity(): Interfaces.Model.IIdentity {
            return this._identity;
        }
        public set Identity(identity: Interfaces.Model.IIdentity) {
            this._identity = identity;
        }

        public get Locale(): string {
            var locale: string = localStorage.getItem('locale');
            if (!locale) {
                locale = "en";
                localStorage.setItem('locale', locale);
            }
            return locale ? locale : "en";
        }

        public set Locale(newlocale: string) {
            var locale: string = this.Locale;
            if (!locale || locale !== newlocale) {
                localStorage.setItem('locale', newlocale);

                //reload the app
                location.reload();
            }
        }

        public get Uid(): string {
            let uid: string = localStorage.getItem('apsUID');
            if (!uid) {
                uid = M.guid();
                localStorage.setItem('apsUID', uid);
            }
            return uid;
        }

        public get Settings(): Interfaces.Model.ISettings {
            var settings: string = localStorage.getItem('apsSettings');
            return isNullOrEmpty(settings) ? null : JSON.parse(settings);
        }

        public set Settings(value: Interfaces.Model.ISettings) {
            localStorage.setItem('apsSettings', JSON.stringify(value));
            var locale: string = this.Locale;
            if (!locale || locale.toLocaleLowerCase() !== value.Language.Code.toLocaleLowerCase())
                this.Locale = value.Language.Code.toLocaleLowerCase();
        }

        public get PageEditItemHeader(): string {
            var pageEditItemHeader: string = localStorage.getItem('PageEditItemHeader');
            return pageEditItemHeader ? pageEditItemHeader : "";
        }

        public set PageEditItemHeader(pageEditItemHeader: string) {
            localStorage.setItem('PageEditItemHeader', pageEditItemHeader);
        }

        public get PageEditItem(): string {
            var pageEditItem: string = localStorage.getItem('PageEditItem');
            return pageEditItem ? pageEditItem : "";
        }

        public set PageEditItem(pageEditItem: string) {
            localStorage.setItem('PageEditItem', pageEditItem);
        }

        public get NewViewItemId(): number {
            return parseInt(localStorage.getItem('new-view-item-id'), 0);
        }

        public set NewViewItemId(id: number) {
            localStorage.setItem('new-view-item-id', '' + id);
        }

    }
}

export const _appData = new App.Data();

