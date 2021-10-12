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
            this._identity = { Auth: false, Cms: false, Token: '', User: null, SiteUserId: 0 };
        }

        private _identity: Interfaces.Model.IIdentity;
        public get Identity(): Interfaces.Model.IIdentity {
            return this._identity;
        }
        public set Identity(identity: Interfaces.Model.IIdentity) {
            this._identity = identity;
        }

        private _version: string;
        public get Version(): string{
            return this._version;
        }
        public set Version(version: string) {
            this._version = version;
        }

        public get Locale(): Interfaces.Model.ILang {
            var locale: string = localStorage.getItem('locale');
            var result: Interfaces.Model.ILang = undefined;
            if (locale && locale != null && locale != "") {
                try {
                    result = JSON.parse(locale);
                } catch {
                    result = undefined;
                }
            }
            if (!result)
            {
                result = { Id: 0, Code: "EN", Name: "English" };
                localStorage.setItem('locale', JSON.stringify(result));
            }
            return result;
        }

        public set Locale(newlocale: Interfaces.Model.ILang) {
            var locale: Interfaces.Model.ILang = this.Locale;
            if (newlocale && newlocale != null && locale.Id !== newlocale.Id) {
                localStorage.setItem('locale', JSON.stringify(newlocale));
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

            var result: Interfaces.Model.ISettings = isNullOrEmpty(settings) ? null : JSON.parse(settings);
            if (result != null && result.Country == null)
                result.Country = { Id: 0, Code: '', Name: '' };
            return result;
        }

        public set Settings(value: Interfaces.Model.ISettings) {
            localStorage.setItem('apsSettings', JSON.stringify(value));
            var locale: Interfaces.Model.ILang = this.Locale;
            if (value && value.Language && locale.Id !== value.Language.Id)
                this.Locale = value.Language;
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

        public get OrderId(): number {
            return parseInt(localStorage.getItem('order-id'), 0);
        }

        public set OrderId(id: number) {
            localStorage.setItem('order-id', '' + id);
        }

        public get MessageId(): number {
            return parseInt(localStorage.getItem('message-id'), 0);
        }

        public set MessageId(id: number) {
            localStorage.setItem('message-id', '' + id);
        }

        public get IsBasketCheckOut(): boolean {
            var basketCheckOut = localStorage.getItem('basketCheckOut');
            return (basketCheckOut && basketCheckOut == "true");
        }

        public set IsBasketCheckOut(val: boolean) {
            if (val === true)
                localStorage.setItem('basketCheckOut', 'true');
            else
                localStorage.removeItem('basketCheckOut');
        }

        public get BasketIsInit(): boolean {
            var basketIsInit = localStorage.getItem('basketIsInit');
            return (basketIsInit && basketIsInit == "true" ? true : false);
        }

        public set BasketIsInit(val: boolean) {
            if (val === true)
                localStorage.setItem('basketIsInit', 'true');
            else
                localStorage.removeItem('basketIsInit');
        }
    }
}

export const _appData = new App.Data();

