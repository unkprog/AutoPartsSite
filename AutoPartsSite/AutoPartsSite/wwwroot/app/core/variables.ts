/// <amd-dependency path="i18n!nls/strings" />

export declare let _app: Interfaces.IApplication;
export declare let _identity: Interfaces.Model.IIdentity;
export declare let _main: Interfaces.IControllerNavigation;
export declare let _statres: (id: string) => string;
export declare let _absUrl: (id: string) => string;   //Create absolute ref to resource
export declare let _showError: (error: string) => void;


export declare let _appSettings: {
    IsDebug: boolean;
    Version: string;
    Language: string;
    ServerRegister: string;
};


namespace App {
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

let staticResources = new App.StaticResources();
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


