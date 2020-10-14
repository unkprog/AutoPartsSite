define(["require", "exports", "app/core/variables", "app/core/basecontroller"], function (require, exports, vars, base) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var News;
        (function (News) {
            class Index extends base.Controller.Base {
                constructor() {
                    super();
                }
                createOptions() {
                    return { Url: "/app/controller/news/index.html", Id: "news-view" };
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$news")
                    });
                }
                createEvents() {
                }
                destroyEvents() {
                }
            }
            News.Index = Index;
        })(News = Controller.News || (Controller.News = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("news/index", function (module) { return new module.Controller.News.Index(); });
});
//# sourceMappingURL=index.js.map