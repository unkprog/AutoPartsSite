namespace Interfaces {
    export interface IServiceOptions {
        BaseUrl: string;
        OnError?: (e: any) => boolean;
    }

    export interface IServiceCallOptions {
        Action: string;
        CrossDomain?: boolean;
        RequestData?: any;
        Callback?: (responseData: any) => void;
        Error?: (e: any) => void;
    }

    export interface IService {
        Options: IServiceOptions;
        GetApi(options: IServiceCallOptions): void;
        PostApi(options: IServiceCallOptions): void;
    }

    export interface IPOSTerminalService extends IService {
        Change: { (salepoint: number, Callback: (responseData: any) => void) };
        ChangeNew: { (salepoint: number, Callback: (responseData: any) => void) };
        ChangeClose: { (id: number, Callback: (responseData: any) => void) };
    }

    export interface IPrintService extends IService {
        PrintCheck: { (pskey: string, document: string, Callback: (responseData: any) => void, Error: (responseData: any) => void): void; }
    }
}