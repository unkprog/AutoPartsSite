import { _app } from "./variables";

export namespace Services {
    export class BaseService implements Interfaces.IService {

        constructor() {
        }

        public get Options(): Interfaces.IServiceOptions {
            return { BaseUrl: '' };
        }

        protected handleError(e: any) {
            let isHandled: boolean = false;
            _app.HideLoading();

            if (this.Options.OnError)
                isHandled = this.Options.OnError(e);

            if (!isHandled)
                _app.HandleError(e);
        }

        public GetApi(options: Interfaces.IServiceCallOptions): void {
            //_app.ShowLoading();

            let self = this;
            let action = (self.Options && self.Options.BaseUrl ? self.Options.BaseUrl : '') + options.Action;
            $.ajax({
                url: action,
                type: "get",
                dataType: "json",
                processData: true,
                crossDomain: options.CrossDomain,
                data: options.RequestData,
                success: function (responseData, textStatus, jqXHR) {
                    if (responseData.error) {
                        if (options.Error)
                            options.Error(responseData.error);
                        else
                            self.handleError(responseData.error);
                    }
                    else if (options.Callback)
                        options.Callback(responseData);
                    //_app.HideLoading();
                },
                error: function (e, textStatus, errorThrown) {
                    if (options.Error)
                        options.Error(e);
                    else
                        self.handleError(e);
                }
            });
        }

        public PostApi(options: Interfaces.IServiceCallOptions): void {
            //_app.ShowLoading();

            let self = this;
            let action = (self.Options && self.Options.BaseUrl ? self.Options.BaseUrl : '') + options.Action;
            $.ajax({
                url: action,
                type: "post",
                dataType: "json",
                contentType: "application/json",
                data: options.RequestData,
                success: function (responseData, textStatus, jqXHR) {
                    if (responseData.error) {
                        if (options.Error)
                            options.Error(responseData.error);
                        else
                            self.handleError(responseData.error);
                    }
                    else if (options.Callback)
                        options.Callback(responseData);
                   // _app.HideLoading();
                },
                error: function (e, textStatus, errorThrown) {
                    if (options.Error)
                        options.Error(e);
                    else
                        self.handleError(e);
                }
            });
        }
    }
}