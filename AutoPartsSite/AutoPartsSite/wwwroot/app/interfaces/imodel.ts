namespace Interfaces.Model {

    export interface IBaseModel {
        id: number;
    }

    export interface IRegisterModel {
        email: string;
    }

    export interface ILoginModel {
        email: string;
        password: string;
    }

    export interface IClientModel extends IRegisterModel  {
    }

    export interface IIdentity {
        auth: boolean;
        token: string;
        client: IClientModel;
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