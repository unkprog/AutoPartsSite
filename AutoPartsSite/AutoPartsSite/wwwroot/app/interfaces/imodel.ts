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

    export interface IReportFilter extends IDateParams {

    }
}