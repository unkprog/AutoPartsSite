var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/cmsservice"], function (require, exports, vars, base, cmss) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var About;
        (function (About) {
            var AboutView = /** @class */ (function (_super) {
                __extends(AboutView, _super);
                function AboutView() {
                    var _this = _super.call(this) || this;
                    _this.cmsService = new cmss.Services.CmsService();
                    return _this;
                }
                Object.defineProperty(AboutView.prototype, "CmsService", {
                    get: function () {
                        return this.cmsService;
                    },
                    enumerable: false,
                    configurable: true
                });
                AboutView.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({});
                };
                AboutView.prototype.ViewShow = function (e) {
                    var result = _super.prototype.ViewShow.call(this, e);
                    this.loadData();
                    return result;
                };
                AboutView.prototype.loadData = function () {
                    var self = this;
                    vars._app.ShowLoading();
                    var options = this.Options;
                    self.CmsService.Page(vars._app.getLocale(), options.Page, function (responseData) {
                        if (responseData.Result === 0) {
                            var model = responseData.Data;
                            self.View.find('#' + options.Id + '-content').html(model.Content);
                        }
                        else
                            vars._app.ShowError(responseData.Error);
                        vars._app.HideLoading();
                    });
                    return true;
                };
                return AboutView;
            }(base.Controller.Base));
            About.AboutView = AboutView;
        })(About = Controller.About || (Controller.About = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=aboutview.js.map