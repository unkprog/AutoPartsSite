import vars = require('app/core/variables');
import utils = require('app/core/utils');
import base = require('app/core/basecontroller');
import cmss = require('app/services/cmsservice')

export namespace Controller.Cms.Card {
    export class CardFilterSettings implements Interfaces.Control.ICardFilterSettings {
        constructor(setupRows: { (): void; }, fieldSearch:string) {
            this.fieldSearch = fieldSearch;
            this.setupRows = setupRows;
            this._model = this.createModel();
        }
       
        private setupRows: { (): void; };

        private fieldSearch: string;
        public get FieldSearch(): string {
            return this.fieldSearch;
        }
        public set FieldSearch(val: string) {
            this.fieldSearch = val;
        }

        private _model: kendo.data.ObservableObject;
        public get Model(): kendo.data.ObservableObject {
            return this._model;
        }

        private getDefDate(): Date {
            let dateTime: Date = new Date();
            dateTime.setHours(0, 0, 0, 0);
            return dateTime;
        }

        protected createModel(): kendo.data.ObservableObject {
            let data: any = this.restoreFilter();
           
            let result: kendo.data.ObservableObject = new kendo.data.ObservableObject({
                "labelDateFrom": vars._statres("label$date$from"),
                "labelDateTo": vars._statres("label$date$to"),
                "labelFind": vars._statres("label$find"),
                "datefrom": "",
                "dateto": ""
            });
            if (data) {
                result.set("datefrom", data.datefrom);
                result.set("dateto", data.dateto);
            }
            return result;
        }

        public restoreFilter(): any{
            let result: any;
            //localStorage.clear();
            let saved: any = window.localStorage.getItem(this.fieldSearch);
            if (!saved || saved === "\"{}\"") {
                let dateTime: string = utils.date_ddmmyyyy(this.getDefDate());
                result = { datefrom: dateTime, dateto: dateTime };
            }
            else
                result = JSON.parse(saved);
            return result;
        }

        public saveFilter() {
            let dataToSave = { datefrom: this._model.get("datefrom"), dateto: this._model.get("dateto") };
            let toSave: string = JSON.stringify(dataToSave);
            window.localStorage.setItem(this.fieldSearch, toSave);
        }

        private filterControl: JQuery;
        private dateFromControl: JQuery;
        private dateToControl: JQuery;
        private searchButton: JQuery;
        
        public InitControls(): JQuery {
            let controller = this;
            let filterHtml: string = '';
            filterHtml += '<div class="row row-inputs">';
            filterHtml += '    <div class="input-field col s6 m4 l3 xl2">';
            filterHtml += '       <input id="card-filter-view-date-start" type="text" class="datepicker">';
            filterHtml += '       <label for="card-filter-view-date-start" data-bind="text:labelDateFrom"></label>';
            filterHtml += '    </div>';
            filterHtml += '    <div class="input-field col s6 m4 l3 xl2">';
            filterHtml += '       <input id="card-filter-view-date-end" type="text" class="datepicker">';
            filterHtml += '       <label for="card-filter-view-date-end" data-bind="text:labelDateTo"></label>';
            filterHtml += '    </div>';
            filterHtml += '</div>';
            filterHtml += '<div class="row row-inputs">';
            filterHtml += '    <div class="input-field col s12 m12 l12 xl12 col-input-numpad" style="margin-top: 0;">';
            filterHtml += '        <a id="card-filter-view-btn-find" class="btn btncol"  data-bind="text:labelFind"></a>'; // data-bind="text:labelDate"
            filterHtml += '    </div>';
            filterHtml += '</div>';
            filterHtml += '';
            controller.filterControl = $(filterHtml);
            controller.dateFromControl = controller.filterControl.find("#card-filter-view-date-start");
            controller.dateFromControl.datepicker({
                format: "dd.mm.yyyy", onSelect: function (newDate: Date) {
                    controller._model.set("datefrom", utils.date_ddmmyyyy(newDate));
                }
            });
            controller.dateToControl = controller.filterControl.find("#card-filter-view-date-end");
            controller.dateToControl.datepicker({
                format: "dd.mm.yyyy", onSelect: function (newDate: Date) {
                    controller._model.set("dateto", utils.date_ddmmyyyy(newDate));
                }
            });

            controller.dateFromControl.val(utils.date_ddmmyyyy(controller._model.get("datefrom")));
            controller.dateToControl.val(utils.date_ddmmyyyy(controller._model.get("dateto")));

            controller.searchButton = controller.filterControl.find("#card-filter-view-btn-find");
            return controller.filterControl;
        }

        public ViewControls(): void {

        }
        public ResizeControls(): void {
        }

        public createEvents(): void {
            kendo.bind(this.filterControl, this._model);
            if (this.searchButton) this.SearchButtonClick = utils.createTouchClickEvent(this.searchButton, this.searchButtonClick, this);
        }

        public destroyEvents(): void {
            this.saveFilter();
            this.filterControl.unbind();
            if (this.searchButton) utils.destroyTouchClickEvent(this.searchButton, this.SearchButtonClick);
        }

        public SearchButtonClick: { (e: any): void; };
        private searchButtonClick(e: any) {
            e.preventDefault();
            if (this.setupRows)
                this.setupRows();
            return false;
        }


        public GetItemsForView(data: Interfaces.Model.IEditorModel[]): Interfaces.Model.IEditorModel[] {
            let result: Interfaces.Model.IEditorModel[] = data; 
            return result;
        }
    }

    export class Card extends base.Controller.BaseCard {
        constructor() {
            super();
        }

        private cmsService: cmss.Services.CmsService;
        public get CmsService(): cmss.Services.CmsService {
            if (!this.cmsService)
                this.cmsService = new cmss.Services.CmsService();
            return this.cmsService;
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return { Url: "/app/controller/cms/card/card.html", Id: "card-view" };
        }

        protected createCardFilterSettings(): Interfaces.Control.ICardFilterSettings {
            return new CardFilterSettings($.proxy(this.loadData, this), this.FilterId);
        }

        protected createCardSettings(): Interfaces.Control.ICardSettings {
            return {
                FieldId: this.FieldId, FilterSettings: this.CreateCardFilterSettings, ValueIdNew: -1, EditIdName: this.EditIdName, EditController: this.EditController,
                IsAdd: this.IsAdd, IsAddCopy: this.IsAddCopy, IsEdit: this.IsEdit, IsDelete: this.IsDelete, IsSelect: this.IsSelect,
                Load: this.LoadProxy, Delete: this.DeleteProxy,
                Columns: this.Columns
            };
        }

        protected get FieldId(): string {
            return "id";
        }

        protected get IsAdd(): boolean {
            return true;
        }

        protected get IsAddCopy(): boolean {
            return false;
        }

        protected get IsEdit(): boolean {
            return true;
        }

        protected get IsDelete(): boolean {
            return true;
        }

        protected get IsSelect(): boolean {
            return false;
        }
       
        protected get CreateCardFilterSettings(): any {
            return undefined; //this.createCardFilterSettings()
        }

        protected get LoadProxy(): any {
            return undefined; //$.proxy(this.getRecords, this);
        }

        protected get DeleteProxy(): any {
            return undefined; //$.proxy(this.CmsService.DelDocument, this.CmsService);
        }

        protected get Columns(): Interfaces.Control.IBaseColumn[] {
            return this.columns();
        }

        protected columns(): Interfaces.Control.IBaseColumn[] {
            return [];
        }

        protected get EditIdName(): string {
            return "";
        }

        protected get EditController(): string {
            return "";
        }

        protected get FilterId(): string {
            return "CardFilterSettings";
        }

        //protected get DocType(): number {
        //    return 0;
        //}

        //protected get DateFrom(): string {
        //    let settings: CardFilterSettings = this.CardSettings.FilterSettings as CardFilterSettings;
        //    let date: string = (settings ? settings.Model.get("datefrom") : undefined);
        //    return (utils.isNullOrEmpty(date) ? '30.12.1899' : date);
        //}

        //protected get DateTo(): string {
        //    let settings: CardFilterSettings = this.CardSettings.FilterSettings as CardFilterSettings;
        //    let date: string = (settings ? settings.Model.get("dateto") : undefined);
        //    return (utils.isNullOrEmpty(date) ? '30.12.1899' : date);
        //}

        //private getRecords(Callback: (responseData: any) => void) {
        //    this.CardSettings.FilterSettings.saveFilter();
        //    let params: Interfaces.Model.ICardParams = { id: 0, doctype: this.DocType, datefrom: this.DateFrom, dateto: this.DateTo }
        //    this.CmsService.GetDocuments(params, (responseData: any) => {
        //        if (Callback)
        //            Callback(responseData);
        //    });
        //}

    }
}