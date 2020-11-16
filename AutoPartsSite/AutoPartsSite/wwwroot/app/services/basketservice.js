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
define(["require", "exports", "app/core/baseservice", "app/core/variables"], function (require, exports, base, vars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Services = void 0;
    var Services;
    (function (Services) {
        var BasketService = /** @class */ (function (_super) {
            __extends(BasketService, _super);
            function BasketService() {
                return _super.call(this) || this;
            }
            Object.defineProperty(BasketService.prototype, "Options", {
                get: function () {
                    return { BaseUrl: '/api/basket' };
                },
                enumerable: false,
                configurable: true
            });
            BasketService.prototype.Count = function (Callback) {
                this.GetApi({ Action: "/count", RequestData: { uid: vars._appData.Uid }, Callback: Callback });
            };
            BasketService.prototype.Add = function (id, Callback) {
                this.PostApi({ Action: "/add", RequestData: JSON.stringify({ uid: vars._appData.Uid, id: id, qty: 1 }), Callback: Callback });
            };
            BasketService.prototype.Update = function (id, qty, Callback) {
                this.PostApi({ Action: "/update", RequestData: JSON.stringify({ uid: vars._appData.Uid, id: id, qty: qty }), Callback: Callback });
            };
            BasketService.prototype.Delete = function (id, Callback) {
                this.PostApi({ Action: "/delete", RequestData: JSON.stringify({ uid: vars._appData.Uid, id: id, qty: 0 }), Callback: Callback });
            };
            BasketService.prototype.View = function (Callback) {
                var pq = {
                    uid: vars._appData.Uid,
                    siteUserId: vars._appData.Identity.SiteUserId,
                    countryId: vars._appData.Settings.Country.Id,
                    languageId: vars._appData.Settings.Language.Id,
                    currencyId: vars._appData.Settings.Currency.Id
                };
                this.GetApi({ Action: "/view", RequestData: pq, Callback: Callback });
            };
            return BasketService;
        }(base.Services.BaseService));
        Services.BasketService = BasketService;
    })(Services = exports.Services || (exports.Services = {}));
});
//# sourceMappingURL=basketservice.js.map