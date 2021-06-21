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
define(["require", "exports", "app/core/variables", "app/core/basecontroller", "app/services/searchservice", "app/core/utils"], function (require, exports, vars, base, srh, utils) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Search;
        (function (Search) {
            var AskQuestion = /** @class */ (function (_super) {
                __extends(AskQuestion, _super);
                function AskQuestion() {
                    var _this = _super.call(this) || this;
                    _this.searchService = new srh.Services.SearchService();
                    return _this;
                }
                Object.defineProperty(AskQuestion.prototype, "SearchService", {
                    get: function () {
                        return this.searchService;
                    },
                    enumerable: false,
                    configurable: true
                });
                AskQuestion.prototype.createOptions = function () {
                    var options = { Url: "/app/controller/search/askquestion.html", Id: "askquestion-view", Page: "/search/askquestion" };
                    return options;
                };
                AskQuestion.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": vars._statres("label$ask$question"),
                        "AskQuestion": {
                            Name: "",
                            Email: "",
                            Question: ""
                        },
                        "labelName": vars._statres("label$ask$name"),
                        "labelEmail": vars._statres("label$email"),
                        "labelQuestion": vars._statres("label$howcan$help"),
                        "labelSend": vars._statres("label$send"),
                    });
                };
                AskQuestion.prototype.ViewInit = function (view) {
                    return _super.prototype.ViewInit.call(this, view);
                };
                AskQuestion.prototype.OnViewInit = function () {
                    var self = this;
                    if (vars._appData.Identity && vars._appData.Identity.User && vars._appData.Identity.User.Email && !utils.isNullOrEmpty(vars._appData.Identity.User.Email))
                        self.Model.set("AskQuestion.Email", vars._appData.Identity.User.Email);
                    var artikle = localStorage.getItem("artikle");
                    localStorage.removeItem("artikle");
                    if (!utils.isNullOrEmpty(artikle)) {
                        self.Model.set("AskQuestion.Question", vars._statres("label$ask$partnumber$available") + ' - <' + artikle + '>?');
                    }
                };
                AskQuestion.prototype.ViewShow = function (e) {
                    var result = _super.prototype.ViewShow.call(this, e);
                    var self = this;
                    M.updateTextFields();
                    M.textareaAutoResize(self.View.find('#askquestion-view-question'));
                    return result;
                };
                AskQuestion.prototype.createEvents = function () {
                    this.SendButtonClick = this.createClickEvent("askquestion-send-btn", this.sendButtonClick);
                };
                AskQuestion.prototype.destroyEvents = function () {
                    localStorage.removeItem("artikle");
                    this.destroyClickEvent("askquestion-send-btn", this.SendButtonClick);
                };
                AskQuestion.prototype.sendButtonClick = function (e) {
                    vars._app.ShowLoading(false);
                    var question = this.Model.get("AskQuestion").toJSON();
                    if (this.validate(question)) {
                        this.SearchService.SendAskQuestion(question, function (responseData) {
                            if (responseData.Result === 0) {
                                vars._app.OpenController({ urlController: "search/index" });
                            }
                            else {
                                vars._app.ShowError(responseData.Error);
                            }
                            vars._app.HideLoading();
                        });
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                };
                AskQuestion.prototype.validate = function (model) {
                    var result = true;
                    if (!utils.validateEmail(model.Email)) {
                        M.toast({ html: vars._statres("msg$error$emailIncorrect") });
                        result = false;
                    }
                    if (utils.isNullOrEmpty(model.Question)) {
                        M.toast({ html: vars._statres("label$ask$question$incorrect") });
                        result = false;
                    }
                    return result;
                };
                return AskQuestion;
            }(base.Controller.Base));
            Search.AskQuestion = AskQuestion;
        })(Search = Controller.Search || (Controller.Search = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
    vars.registerController("search/askquestion", function (module) { return new module.Controller.Search.AskQuestion(); });
});
//# sourceMappingURL=askquestion.js.map