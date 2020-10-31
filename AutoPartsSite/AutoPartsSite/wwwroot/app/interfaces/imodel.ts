namespace Interfaces.Model {

    export interface IBaseModel {
        Id: number;
    }

    export interface IRegisterModel {
        Email: string;
    }

    export interface ILoginModel extends IRegisterModel {
        Email: string;
        Pass: string;
    }

    export interface IUserModel extends IRegisterModel  {

    }

    export interface IIdentity {
        Auth: boolean;
        Cms: boolean;
        Token: string;
        User: IUserModel;
    }

    export interface IEditorModel extends IBaseModel {

    }

    export interface ITableRowModel {

    }

    export interface IDateParams {
        datefrom: string;
        dateto: string;
    }

    export interface ICardParams extends IDateParams {
        id: number;
        doctype: number;
    }

    export interface ICardFilter extends IDateParams {
    }

    export interface IReportFilter extends IDateParams {

    }

    export interface IContent {
        Content: string;
    }

    export interface IPage extends IContent {

    }

    export interface INew extends IPage {
        Header: string;
        ReleaseDate: string;
    }

    export interface IPageEdit extends IEditorModel {
        Page: string;
        ContentEn: string;
        ContentRu: string;
    }

    export interface INewEdit extends IPageEdit
    {
        HeaderEn: string;
        HeaderRu: string;
        ReleaseDate: string;
    }
}