namespace Interfaces.Model {

    export interface IBaseModel {
        Id: number;
    }

    export interface IReferenceNamedDbModel extends IBaseModel {
        Code: string;
        Name: string;
    }

    export interface IRegisterModel {
        Email: string;
    }

    export interface ILoginModel extends IRegisterModel {
        Email: string;
        Pass: string;
        Uid: string;
    }

    export interface IProfileUserModel extends ILoginModel {
        ChangePass: string;
    }

    export interface IUserModel extends IRegisterModel  {

    }

    export interface IIdentity {
        Auth: boolean;
        Cms: boolean;
        Token: string;
        User: IUserModel;
        SiteUserId: number;
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

    export interface ILang extends IReferenceNamedDbModel {
        
    }

    export interface ICurrency extends IReferenceNamedDbModel {
        Symbol: string;
        ShowLeft: boolean;
    }

    export interface ISettings {
        Language: ILang;
        Country: IReferenceNamedDbModel;
        Currency: ICurrency;
    }

    export interface ISettingsData {
        Current: ISettings;
        Countries: IReferenceNamedDbModel[];
        Languages: ILang[];
        Currencies: ICurrency[];
    }

    export interface IAddressInfo
    {
        FullName: string;
        CompanyId: number;
        Company: IReferenceNamedDbModel;
        CountryId: number;
        Country: IReferenceNamedDbModel;
        Region: string;
        City: string;
        ZipCode: string;
        Street: string;
        PhoneCode: string;
        Phone: string;
        PhoneExt: string;
        Email: string;
    }

    export interface IDeliveryAddressInfo extends IAddressInfo {
    }

    export interface IBillingAddressInfo extends IAddressInfo {
    }

    export interface IAskQuestion  {
        Name: string;
        Email: string;
        Question: string;
    }
}