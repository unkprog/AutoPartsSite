namespace Interfaces.Control {

    export interface IBaseColumn {
        Header?: string;
        HeaderStyle?: string;
        HeaderTemplate?: string;
        Field?: string;
        FieldStyle?: string;
        FieldTemplate?: string;
        FieldEditTemplate?: string;
        FieldEditStyle?: string;
        WidthPercent?: number;
    }

    export interface ICardColumn extends IBaseColumn {
       
    }

    export interface ICardFilterSettings {
        FieldSearch: string;

        GetItemsForView(data: Interfaces.Model.IEditorModel[]): Interfaces.Model.IEditorModel[]

        InitControls(): JQuery;
        ViewControls(): void;
        ResizeControls(): void;
        createEvents(): void;
        destroyEvents(): void;

        saveFilter(): void;
        restoreFilter(): any;
    }

    export interface ICardSettings {
        FilterSettings: ICardFilterSettings;
        FieldId?: string;
        ValueIdNew: number;
        EditIdName: string;
        IsAdd: boolean;
        IsAddCopy: boolean;
        IsEdit: boolean;
        IsDelete: boolean;
        IsSelect: boolean;
        EditController: string;
        Columns?: ICardColumn[];
        Load: (callback: (responseData: any) => void) => void;
        Delete: (id: number, callback: (responseData: any) => void) => void;
    }


    export interface IEditorButtonSettings {
        IsPrint?: boolean;
        IsSave?: boolean;
        IsCancel?: boolean;
    }

    export interface IEditorSettings {
        EditIdName: string;
        ButtonSetings?: IEditorButtonSettings;
        Load: (id: number, callback: (responseData: any) => void) => void;
        Save: (model: Interfaces.Model.IEditorModel, callback: (responseData: any) => void) => void;
    }

    export interface ITableColumn extends IBaseColumn {
        HeaderGroupName?: string;
        HeaderColSpan?: number;
        IsSum?: boolean;
        IsNumber?: boolean;
        IsOrder?: boolean;
    }

    export interface IControl {
        InitView(): JQuery;
        DestroyView();
        View: JQuery;
    }

    export interface IControlTable extends IControl {
        Columns: ITableColumn[];
        InitView(): JQuery;
        DestroyView();
        TableBody: JQuery;
        IsScroll: boolean;
        Setup(onlyRows?: boolean);
        Rows: Interfaces.Model.ITableRowModel[];
        OnSelect(row: Interfaces.Model.ITableRowModel);
        OnDetalize(row: Interfaces.Model.ITableRowModel);
    }

    export interface IControlEditTable extends IControlTable {
        RowHeaderContextClick: { (e: any): void; };
        RowContextClick: { (e: any): void; };
        GetEditControl: { (field: string): JQuery; };
        CheckValueEditControl: { (field: string, value: any, row: Interfaces.Model.ITableRowModel): boolean; };
    }

    export interface ICheckViewControl extends IControl {
        LabelSize: number;
        Printer: Interfaces.Model.IPrinter;
        PrintService: Interfaces.IPrintService;
    }
}