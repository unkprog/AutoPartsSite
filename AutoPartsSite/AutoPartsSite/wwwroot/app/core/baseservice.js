define(["require", "exports", "./variables"], function (require, exports, variables_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        var BaseService = /** @class */ (function () {
            function BaseService() {
            }
            Object.defineProperty(BaseService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '' };
                },
                enumerable: false,
                configurable: true
            });
            BaseService.prototype.handleError = function (e) {
                var isHandled = false;
                variables_1._app.HideLoading();
                if (this.Options.OnError)
                    isHandled = this.Options.OnError(e);
                if (!isHandled)
                    variables_1._app.HandleError(e);
            };
            BaseService.prototype.GetApi = function (options) {
                //_app.ShowLoading();
                var self = this;
                var action = (self.Options && self.Options.BaseUrl ? self.Options.BaseUrl : '') + options.Action;
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
            };
            BaseService.prototype.PostApi = function (options) {
                //_app.ShowLoading();
                var self = this;
                var action = (self.Options && self.Options.BaseUrl ? self.Options.BaseUrl : '') + options.Action;
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
            };
            return BaseService;
        }());
        Services.BaseService = BaseService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=baseservice.js.map