import vars = require('app/core/variables');
import base = require('app/core/basecontroller');
import srh = require('app/services/searchservice');
import utils = require('app/core/utils');

export namespace Controller.Search {
    export class AskQuestion extends base.Controller.Base {

        constructor() {
            super();
            this.searchService = new srh.Services.SearchService();
        }
        private searchService: srh.Services.SearchService;
        public get SearchService(): srh.Services.SearchService {
            return this.searchService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            let options: Interfaces.IControllerPageOptions = { Url: "/app/controller/search/askquestion.html", Id: "askquestion-view", Page: "/search/askquestion" };
            return options;
        }

        protected createModel(): kendo.data.ObservableObject {
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
        }

        public ViewInit(view: JQuery): boolean {
            return super.ViewInit(view);
        }

        protected OnViewInit(): void {
            let self = this;

            if (vars._appData.Identity && vars._appData.Identity.User && vars._appData.Identity.User.Email && !utils.isNullOrEmpty(vars._appData.Identity.User.Email))
                self.Model.set("AskQuestion.Email", vars._appData.Identity.User.Email);

            let artikle = localStorage.getItem("artikle");
            localStorage.removeItem("artikle");
            if (!utils.isNullOrEmpty(artikle)) {
                self.Model.set("AskQuestion.Question", vars._statres("label$ask$partnumber$available") + ' - <' + artikle + '>?');
            }
        }

        public ViewShow(e: any): boolean {
            let result = super.ViewShow(e);
            let self = this;
            M.updateTextFields();
            M.textareaAutoResize(self.View.find('#askquestion-view-question'));
            return result;
        }

        protected createEvents(): void {
            this.SendButtonClick = this.createClickEvent("askquestion-send-btn", this.sendButtonClick);
        }

        protected destroyEvents(): void {
            localStorage.removeItem("artikle");
            this.destroyClickEvent("askquestion-send-btn", this.SendButtonClick);
        }

        public SendButtonClick: { (e: any): void; };
        private sendButtonClick(e) {
            vars._app.ShowLoading(false);
            let question: Interfaces.Model.IAskQuestion = this.Model.get("AskQuestion").toJSON();
            if (this.validate(question)) {
                this.SearchService.SendAskQuestion(question, (responseData) => {
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
        }

        private validate(model: Interfaces.Model.IAskQuestion): boolean {
            let result: boolean = true;

            if (!utils.validateEmail(model.Email)) {
                M.toast({ html: vars._statres("msg$error$emailIncorrect") });
                result = false;
            }

            if (utils.isNullOrEmpty(model.Question)) {
                M.toast({ html: vars._statres("label$ask$question$incorrect") });
                result = false;
            }

            return result;
        }
    }
}

vars.registerController("search/askquestion", function (module: any): Interfaces.IController { return new module.Controller.Search.AskQuestion(); });