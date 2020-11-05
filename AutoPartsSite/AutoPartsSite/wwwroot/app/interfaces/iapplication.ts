namespace Interfaces {

    export interface IOpenControllerCreate {
        Url: string;
        CreateController: (module: any) => Interfaces.IController;
    }

    export interface IOpenViewTemplate {
        controller: Interfaces.IController;
        isModal?: boolean;
        template?: string;
        backController?: Interfaces.IController;
        isRestore?: boolean;
    }

    export interface IApplication extends IControllerNavigation {
        ShowLoading(): void;
        HideLoading(): void;
        SetControlNavigation(controlNavigation: IControllerNavigation): void;
        HandleError(e: any): void;
        ShowError(e: string): void;
        ShowMessage(header: string, message: string, onClose?: () => void): void;

        Identity: Interfaces.Model.IIdentity;
        //OpenViewModal(options: IOpenViewOptions);
        OpenViewTemplate(options: IOpenViewTemplate);
        IsModal: boolean;
        IsNativeApp: boolean;

        NativeCommand(command: string, data: any);
    }
}