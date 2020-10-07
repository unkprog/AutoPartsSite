namespace Interfaces {

    export interface IControllerOptions {
        Url: string;
        Id: string;
    }

    export interface IController {
        Options: IControllerOptions;
        Model: kendo.data.ObservableObject;
        View: JQuery;

        Header: string;
        ViewInit(view: JQuery): boolean;
        ViewShow(e: any): boolean;
        ViewHide(e: any): void;
        //AfterShow(e: any): void;
        ViewResize(e?: any): void;
    }

    export interface IControllerCard extends IController {
        CardModel: Model.IEditorModel[];
        CardSettings: Control.ICardSettings;
        Add(): void;
        Delete(): void;
        Edit(): void;
        Close(): void;
        getSelectedRowId(): any;
        getSelectedRecord(): Model.IBaseModel;
        OnSelect(controller: IControllerCard): void;
    }

    export interface IControllerEditor extends IController {
        EditorModel: Model.IBaseModel;
        EditorSettings: Control.IEditorSettings;
        EditorHeader: JQuery;
        Print(): void;
        Save(): void;
        Cancel(): void;
    }

    export interface IControllerStack {
        Current: Interfaces.IController;
        Pop: () => void; 
        Push: (controller: Interfaces.IController) => void; 
        Last: Interfaces.IController;
    }

    export interface IOpenControllerOptions {
        urlController: string;
        isModal?: boolean;
        backController?: Interfaces.IController;
        onLoadController?: (controller: Interfaces.IController) => void;
    }


    export interface IOpenViewOptions {
        controller: Interfaces.IController;
        isModal?: boolean;
        backController?: Interfaces.IController;
        isRestore?: boolean;
    }

    export interface IControllerNavigation {
        ControllerBack(e: any): void;
        RestoreController(): void;
        OpenController(options: IOpenControllerOptions): void;
        OpenView(options: IOpenViewOptions): void;
        ResetScroll(): void;
    }

    export interface IMainNavigation extends Interfaces.IControllerNavigation {
        LogIn();
        LogOut();
    }

    export interface IDialog extends IController {
        Show(header: string, e: string): void;
        OnClose: () => void;
    }

    export interface IControllerReport extends IControllerReportWithFilter {
        Columns: Control.ITableColumn[];
        Table: Control.IControlTable;
    }

    export interface IControllerReportWithFilter extends IControllerEditor {
        SaveFilter(): void;
        RestoreFilter(): void;
        Filter: Interfaces.Model.IReportFilter;
    }
}