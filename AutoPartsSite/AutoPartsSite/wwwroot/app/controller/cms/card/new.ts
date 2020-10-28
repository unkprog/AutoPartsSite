import vars = require('app/core/variables');
import card = require('app/controller/cms/card/card');
import utils = require('app/core/utils');
import base = require('app/core/basecontroller');
import cmss = require('app/services/cmsservice')

export namespace Controller.Cms.Card {
    export class New extends card.Controller.Cms.Card.Card {
        constructor() {
            super();
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": vars._statres("label$news"),
                "cardModel": []
            });
        }

        protected get LoadProxy(): any {
            return $.proxy(this.CmsService.CardNews, this.CmsService);
        }

        protected get DeleteProxy(): any {
            return $.proxy(this.CmsService.DelNew, this.CmsService);
        }

        protected columns(): Interfaces.Control.IBaseColumn[] {
            let result: Interfaces.Control.IBaseColumn[] = [
                { Header: vars._statres("label$date"), Field: "ReleaseDate", FieldTemplate: "#=date_ddmmyyyy(new Date(ReleaseDate))#" },
                { Header: vars._statres("label$header") + " En", Field: "HeaderEn" },
                { Header: vars._statres("label$header") + " Ru", Field: "HeaderRu" },
            ];
            return result;
        }

        protected get EditIdName(): string {
            return "id_new";
        }

        protected get FilterId(): string {
            return "NewCardFilterSettings";
        }


        protected get EditController(): string {
            return "cms/editor/new";
        }

        //protected get DocType(): number {
        //    return 50;
        //}

        public ViewInit(view: JQuery): boolean {
            let result: boolean = super.ViewInit(view);

            return result;
        }

    }
}

vars.registerController("cms/card/new", function (module: any): Interfaces.IController { return new module.Controller.Cms.Card.New(); });