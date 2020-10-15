define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/basketservice"], function (require, exports, vars, base, bsk) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Basket;
        (function (Basket) {
            class Index extends base.Controller.Base {
                constructor() {
                    super();
                    this.basketService = new bsk.Services.BasketService();
                }
                get BasketService() {
                    return this.basketService;
                }
                createOptions() {
                    return { Url: "/app/controller/basket/index.html", Id: "basket-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$basket")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            Basket.Index = Index;
        })(Basket = Controller.Basket || (Controller.Basket = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("basket/index", function (module) { return new module.Controller.Basket.Index(); });
});
//# sourceMappingURL=index.js.map