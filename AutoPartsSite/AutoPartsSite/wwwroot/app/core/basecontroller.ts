import utils = require('app/core/utils');
import vars = require('app/core/variables');
import ctrl = require('app/core/basecontrol');

export namespace Controller {
    export class Base implements Interfaces.IController {
        constructor() {
            this._options = this.createOptions();
            this._model = this.createModel();
        }

        protected createOptions(): Interfaces.IControllerOptions {
            return {
                Url: "",
                Id: ""
            };
        }
        private _options: Interfaces.IControllerOptions;
        public get Options(): Interfaces.IControllerOptions {
            return this._options;
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": ""
            });
        }

        private _model: kendo.data.ObservableObject;
        public get Model(): kendo.data.ObservableObject {
            return this._model;
        }

        private _view: JQuery;
        public get View(): JQuery {
            return this._view;
        }


        public get Header(): string { return this._model ? this._model.get("Header") : ""; }
        public set Header(value: string) { if (this._model) this._model.set("Header", value); }

        public ViewInit(view: JQuery): boolean {
            this._view = view;
            kendo.bind(view, this._model);
            this.OnViewInit();
            this.createEvents();
            return true;
        }

        protected rebindModel() {
            kendo.unbind(this._view, this._model);
            kendo.bind(this._view, this._model);
        }

        protected OnViewInit(): void {
        }

        protected createEvents(): void {
        }

        public ViewShow(e: any): boolean {
            M.updateTextFields();
            return true;
        }

        //public AfterShow(e: any): void {

        //}

        public ViewHide(e: any): void {
            this.destroyEvents();

        }

        protected destroyEvents(): void {
        }

        public ViewResize(e?: any): void {
        }

        protected createTouchClickEvent(elemName: string | JQuery, clickFunc: any): any {
            return utils.createTouchClickEvent(elemName, clickFunc, this, this.View);
        }

        protected createDblTouchClickEvent(elemName: string | JQuery, clickFunc: any): any {
            return utils.createDblTouchClickEvent(elemName, clickFunc, this, this.View);
        }

        protected createClickEvent(elemName: string | JQuery, clickFunc: any): any {
            return utils.createClickEvent(elemName, clickFunc, this, this.View);
        }


        protected createKeyPress(elemName: string[], clickFunc: (e: any) => any, controller: Interfaces.IController): any {
            var result = $.proxy(clickFunc, controller);
            $.each(elemName, function (index, el) {
                var $inp = $("#" + el);
                if ($inp.length > 0) {
                    $inp[0].addEventListener("keypress", result, false);
                }
            });
            return result;
        }

        protected destroyTouchClickEvent(elemName: string | JQuery, proxyFunc: any): any {
            utils.destroyTouchClickEvent(elemName, proxyFunc, this.View);
        }

        protected destroyDblTouchClickEvent(elemName: string | JQuery, proxyFunc: any): any {
            utils.destroyDblTouchClickEvent(elemName, proxyFunc, this.View);
        }

        protected destroyClickEvent(elemName: string | JQuery, proxyFunc: any): any {
            utils.destroyClickEvent(elemName, proxyFunc, this.View);
        }

        protected deleteKeyPress(elemName: string[], proxyFunc: (e: any) => any): any {
            $.each(elemName, function (index, el) {
                var $inp = $("#" + el);
                if ($inp.length > 0)
                    $inp[0].removeEventListener("keypress", proxyFunc);
            });
        }
    }

    export class ControllersStack implements Interfaces.IControllerStack {
        private _controllers: Interfaces.IController[] = [];
        private _current: Interfaces.IController;

        public get Current(): Interfaces.IController {
            return this._current;
        }

        public get Last(): Interfaces.IController {
            return (this._controllers.length > 0 ? this._controllers[this._controllers.length - 1] : undefined);
        }

        public Pop(): void {
            if (this._controllers.length > 0)
                this._current = this._controllers.pop();
            else
                this._current = undefined;
        }

        public Push(controller: Interfaces.IController): void {
            var self = this;
            if (controller) {
                self._controllers.push(controller);
                history.pushState({}, '');
            }
            else
                self._controllers = [];
        }
    }

    export class BaseContent extends Base implements Interfaces.IControllerNavigation {

        constructor() {
            super();
            this._controllersStack = new ControllersStack();
            this.ControllerBack = $.proxy(this.controllerBack, this);
            this._controllers = this.ControllersInit();
        }

        private _controllersStack: Interfaces.IControllerStack;
        private _controller: any;
        private _controllers: any;
        private _content: JQuery;
        protected ControllersInit(): any {
            return {};
        }

        protected GetContent(): JQuery {
            return this._content;
        }

        public ViewInit(view): boolean {
            let result: boolean = super.ViewInit(view);
            this._content = this.GetContent();
            return result;
        }

        public ViewShow(e: any): boolean {
            let result: boolean = super.ViewShow(e);
            if (this._controller)
                this._controller.ViewShow(e);
            return result;
        }

        public ResetScroll() {
            this._content.scrollTop(0);
        }

        protected OnSetViewSize(e: any) {
            //let height = window.innerHeight;
            //height = height - this._content.offset().top;
            //this._content.height(height);
        }

        public ViewResize(e) {
            if (this._content) 
                this.OnSetViewSize(e)

            if (this._controller)
                this._controller.ViewResize(e);
        }

        public ControllerBack: { (e: any): void; };
        private controllerBack(e): void {
            if (vars._app.IsModal)
                vars._app.ControllerBack(e);
            else {
                this._controllersStack.Pop();
                this.RestoreController();
            }
        }

        public RestoreController() {
            if (this._controllersStack.Current)
                this.OpenView({ controller: this._controllersStack.Current, isRestore: true });
        }

        public OpenController(options: Interfaces.IOpenControllerOptions) {
            vars._app.OpenController(options);
        }

        public OpenView(options: Interfaces.IOpenViewOptions) {//controller: Interfaces.IController, backController?: Interfaces.IController, isRestore: boolean = false) {
            var self = this;

            if (options.isModal && options.isModal === true) {
                vars._app.OpenView(options);
                return;
            }

            if ($("#" + options.controller.Options.Id).length > 0) return;     //Already loaded and current
            vars._app.ShowLoading(true);

            $.when($.ajax({ url: options.controller.Options.Url/*, cache: false*/ })).done((template) => {
                self.OpenViewTemplate({ controller: options.controller, template: template, backController: options.backController, isRestore: options.isRestore, isPopState: options.isPopState });
            }).fail((e) => {
                vars._app.HideLoading();
            });
        }

        public OpenViewTemplate(options: Interfaces.IOpenViewTemplate) {
            let self = this;
            //if (options.isModal && options.isModal === true) {
            //    _app.OpenViewTemplate(options);
            //    return;
            //}

            let isInit: boolean = false;
            try {
                if (self._controller) {
                    self._controller.ViewHide(self);
                    self._controller.View.remove();
                }

                self._controller = options.controller;
                if (!options.isRestore)
                    if (options.backController)
                        self._controllersStack.Push(options.backController);

                self.SetHeader(self._controller);
                try {
                    let view: any = $(options.template);
                    if (view.length > 0) {
                        for (let i = 0, icount = view.length; i < icount; i++) {
                            if (view[i] && self._controller.Options.Id === view[i].id) {
                                view = $(view[i]);
                                break;
                            }
                        }
                    }
                    isInit = self._controller.ViewInit(view);
                    self.ResetScroll();
                    let pageOpt = options.controller.Options as Interfaces.IControllerPageOptions;
                    //if (options.isPopState == undefined || options.isPopState == false)
                        //history.pushState(pageOpt, options.controller.Header, pageOpt ? pageOpt.Page : null);
                    var hr = window.location.href.toLocaleLowerCase();

                    var i = hr.indexOf('?');
                    hr = (i > -1 ? hr.substring(i) : '');

                    history.replaceState(pageOpt, options.controller.Header, (pageOpt && pageOpt.Page ? pageOpt.Page : '/') + hr);
                    self._content.html(view[0]);
                    isInit = self._controller.ViewShow(self) && isInit;
                    self._controller.ViewResize(self);
                }
                catch (ex) {
                    console.log(ex);
                }
            } finally {
                if (isInit)
                    vars._app.HideLoading();
            }
        }


        protected SetHeader(controller: Interfaces.IController) {
            //TODO: Пока не заморачиваемся с заголовком
            //let header = controller.Header;
            //if (header)
            //    self._model.set("AppHeader", header); // + ' ' + self.contentControl.width()
            //else
            //    if ("POS Cloud" !== self._model.get("AppHeader"))
            //        self._model.set("AppHeader", "POS Cloud");
        }
    }

    export class BaseEditor extends Base implements Interfaces.IControllerEditor {

        constructor() {
            super();
            this.editorSettings = this.createEditorSettings();
            if (!this.editorSettings.ButtonSetings)
                this.editorSettings.ButtonSetings = { IsSave: true, IsCancel: true };
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "editModel": {},
            });
        }

        public get EditorModel(): Interfaces.Model.IEditorModel {
            return this.Model.get("editModel").toJSON();
        }

        private editorSettings: Interfaces.Control.IEditorSettings;
        public get EditorSettings(): Interfaces.Control.IEditorSettings {
            return this.editorSettings;
        }

        protected createEditorSettings(): Interfaces.Control.IEditorSettings {
            return { EditIdName: this.EditIdName, Load: this.LoadProxy, Save: this.SaveProxy };
        }

        protected get EditIdName(): string {
            return "";
        }

        protected get LoadProxy(): any {
            return undefined; 
        }

        protected get SaveProxy(): any {
            return undefined; 
        }

        private navHeader: JQuery;
        private btnPrint: JQuery;
        private btnSave: JQuery;
        private btnCancel: JQuery;
        private tooltips: JQuery;

        public get EditorHeader(): JQuery {
            return (this.editorSettings.ButtonSetings.IsSave === true || this.editorSettings.ButtonSetings.IsCancel === true ? this.navHeader : undefined);
        }

        public ViewInit(view: JQuery): boolean {

            let navbarHeader: string = '<div class="navbar-fixed editor-header">';
            navbarHeader += '        <nav class="editor-header-nav">';
            navbarHeader += '            <div class="nav-wrapper editor-header">';
            navbarHeader += '                <a class="editor-header-title">' + this.Header + '</a>';
            navbarHeader += '                <ul id="editButtons" class="right"></ul>';
            navbarHeader += '            </div>';
            navbarHeader += '        </nav>';
            navbarHeader += '    </div>';

            this.navHeader = $(navbarHeader);

            this.btnPrint = $('<li><a id="editor-btn-print" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$print") + '"><i class="material-icons editor-header">print</i></a></li>');
            this.btnSave = $('<li><a id="editor-btn-save" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$save") + '"><i class="material-icons editor-header">done</i></a></li>');
            this.btnCancel = $('<li><a id="editor-btn-cancel" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$cancel") + '"><i class="material-icons editor-header">close</i></a></li>');

            let editButtons: JQuery = this.navHeader.find("#editButtons");
            if (this.editorSettings.ButtonSetings.IsPrint === true) editButtons.append(this.btnPrint);
            if (this.editorSettings.ButtonSetings.IsSave === true) editButtons.append(this.btnSave);
            if (this.editorSettings.ButtonSetings.IsCancel === true) editButtons.append(this.btnCancel);

            if (this.editorSettings.ButtonSetings.IsSave === true || this.editorSettings.ButtonSetings.IsCancel === true)
                view.prepend(this.navHeader);

            this.tooltips = this.navHeader.find(".tooltipped");
            super.ViewInit(view);

            return this.loadData();

        }

        public ViewShow(e): boolean {
            if (this.tooltips)
                this.tooltips.tooltip();
            return super.ViewShow(e);
        }

        public ViewHide(e) {
            super.ViewHide(e);
            if (this.btnPrint)
                this.btnPrint.remove();
            if (this.btnSave)
                this.btnSave.remove();
            if (this.btnCancel)
                this.btnCancel.remove();
            if (this.tooltips)
                this.tooltips.tooltip("destroy");
        }

        protected createEvents(): void {
            this.PrintButtonClick = this.createTouchClickEvent(this.btnPrint, this.printButtonClick);
            this.SaveButtonClick = this.createTouchClickEvent(this.btnSave, this.saveButtonClick);
            this.CancelButtonClick = this.createTouchClickEvent(this.btnCancel, this.cancelButtonClick);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.btnPrint, this.PrintButtonClick);
            this.destroyTouchClickEvent(this.btnSave, this.SaveButtonClick);
            this.destroyTouchClickEvent(this.btnCancel, this.CancelButtonClick);
        }

        public PrintButtonClick: { (e: any): void; };
        private printButtonClick(e): void {
                this.Print();
        }

        public SaveButtonClick: { (e: any): void; };
        private saveButtonClick(e): void {
            if (this.validate()) {
                this.Save();
            }
        }

        public CancelButtonClick: { (e: any): void; };
        private cancelButtonClick(e): void {
            this.Cancel();
            vars._main.ControllerBack(e);
        }

        protected loadData(): boolean {
            let controller = this;
            if (controller.EditorSettings && controller.EditorSettings.Load) {
                let id: number = (vars._editorData[controller.EditorSettings.EditIdName] ? vars._editorData[controller.EditorSettings.EditIdName] : 0);
                controller.EditorSettings.Load(id, (responseData) => {
                    if (vars._editorData.isCopy === true)
                        responseData.Data.id = 0;
                    controller.Model.set("editModel", responseData.Data);
                    controller.afterLoad(responseData);
                    controller.endLoad();
                });
                return false;
            }
            controller.afterLoad();
            controller.endLoad();
            return true;
        }

        protected afterLoad(responseData?: any): void {
        }

        protected endLoad(): void {
            M.updateTextFields();
            vars._app.HideLoading();
            this.View.show();
        }

        protected validate(): boolean {
            return true;
        }

        protected endSave(): void {
            vars._main.ControllerBack(this);
        }

        protected getSaveModel(): Interfaces.Model.IEditorModel {
            return this.EditorModel;
        }

        public Print() {

        }

        public Save(): void {
            let controller = this;
            if (controller.EditorSettings && controller.EditorSettings.Save) {
                let model: Interfaces.Model.IEditorModel = controller.getSaveModel();
                controller.EditorSettings.Save(model, (responseData) => {
                    controller.endSave();
                });
                return;
            }
            controller.endSave();
        }

        public Cancel(): void {
        }
    }

    export class BaseCard extends Base implements Interfaces.IControllerCard {

        constructor() {
            super();
            this.cardSettings = this.createCardSettings();
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "cardModel": [],
            });
        }

        public get CardModel(): Interfaces.Model.IEditorModel[] {
            return this.Model.get("cardModel").toJSON();
        }

        private cardSettings: Interfaces.Control.ICardSettings;
        public get CardSettings(): Interfaces.Control.ICardSettings {
            return this.cardSettings;
        }

        private navHeader: JQuery;
        private btnAdd: JQuery;
        private btnAddCopy: JQuery;
        private btnDelete: JQuery;
        private btnEdit: JQuery;
        private btnSelect: JQuery;
        private btnClose: JQuery;

        private tableRow: JQuery;
        private tableHead: JQuery;
        private tableBody: JQuery;
        private tooltips: JQuery;

        public ViewInit(view: JQuery): boolean {
            let controls: Array<JQuery> = [];

            controls.push(this.initNavHeader());
            let filterControl: JQuery = (this.cardSettings && this.cardSettings.FilterSettings ? this.cardSettings.FilterSettings.InitControls() : undefined);
            if (filterControl)
                controls.push(filterControl);
            controls.push(this.initializeTableRow());

            view.append(controls);
            super.ViewInit(view);
            return this.loadData();
        }

        protected initNavHeader(): JQuery {

            let navbarHeader: string = '<div class="navbar-fixed editor-header">';
            navbarHeader += '        <nav class="editor-header-nav">';
            navbarHeader += '            <div class="nav-wrapper editor-header">';
            navbarHeader += '                <a class="editor-header-title">' + this.Header + '</a>';
            navbarHeader += '                <ul id="cardButtons" class="right"></ul>';
            navbarHeader += '            </div>';
            navbarHeader += '        </nav>';
            navbarHeader += '    </div>';
            this.navHeader = $(navbarHeader);

            if (this.CardSettings.IsEdit) this.btnEdit = $('<li><a id="card-btn-edit" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$edit") + '"><i class="material-icons editor-header">edit</i></a></li>');
            if (this.CardSettings.IsAdd) this.btnAdd = $('<li><a id="card-btn-add" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$add") + '"><i class="material-icons editor-header">add</i></a></li>');
            if (this.CardSettings.IsAddCopy) this.btnAddCopy = $('<li><a id="card-btn-addcopy" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$addcopy") + '"><i class="material-icons editor-header">exposure_plus_1</i></a></li>');
            if (this.CardSettings.IsDelete) this.btnDelete = $('<li><a id="card-btn-delete" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$delete") + '"><i class="material-icons editor-header">delete_forever</i></a></li>');
            if (this.CardSettings.IsSelect) this.btnSelect = $('<li><a id="editor-btn-select" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$select") + '"><i class="material-icons editor-header">done</i></a></li>');

            this.btnClose = $('<li><a id="card-btn-close" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$cancel") + '"><i class="material-icons editor-header">close</i></a></li>');

            let cardButtons: JQuery = this.navHeader.find("#cardButtons");
            cardButtons.append(this.btnEdit).append(this.btnAdd).append(this.btnAddCopy).append(this.btnDelete).append(this.btnSelect).append(this.btnClose);
            this.tooltips = cardButtons.find(".tooltipped");
            return this.navHeader;
        }



        protected initializeTableRow(): JQuery {
            let navbarHeader: string = '<div class="row row-table">';
            navbarHeader += '    <div class="col s12 m12 l12 xl12 col-table">';
            navbarHeader += '        <table class="highlight">';
            navbarHeader += '            <thead></thead>';
            navbarHeader += '            <tbody></tbody>';
            navbarHeader += '        </table>';
            navbarHeader += '    </div>';
            navbarHeader += '</div>';
            this.tableRow = $(navbarHeader);
            this.tableHead = this.tableRow.find('thead');
            this.tableBody = this.tableRow.find('tbody');

            return this.tableRow;
        }

        public ViewResize(e: any): void {
            super.ViewResize(e);
            if (this.cardSettings && this.cardSettings.FilterSettings)
                this.cardSettings.FilterSettings.ResizeControls();

            let tbody: JQuery = this.tableBody;
            if (tbody && tbody.length > 0) {
                tbody.height($(window).height() - tbody.offset().top - tbody.parent().parent().parent().parent().parent().scrollTop() - (0.2 * parseFloat(getComputedStyle(tbody[0]).fontSize)) - 1);
            }
        }

        public ViewShow(e): boolean {
            if (this.cardSettings && this.cardSettings.FilterSettings)
                this.cardSettings.FilterSettings.ViewControls();
            if (this.tooltips)
                this.tooltips.tooltip();
            return super.ViewShow(e);
        }

        public ViewHide(e) {
            super.ViewHide(e);
            if (this.btnEdit)
                this.btnEdit.remove();
            if (this.btnAdd)
                this.btnAdd.remove();
            if (this.btnAddCopy)
                this.btnAddCopy.remove();
            if (this.btnDelete)
                this.btnDelete.remove();
            if (this.btnClose)
                this.btnClose.remove();
            if (this.btnSelect)
                this.btnSelect.remove();
            if (this.tooltips)
                this.tooltips.tooltip("destroy");
        }

        private proxySearch;
        protected createEvents(): void {
            this.EditButtonClick = this.createTouchClickEvent(this.btnEdit, this.editButtonClick);
            this.AddButtonClick = this.createTouchClickEvent(this.btnAdd, this.addButtonClick);
            this.AddCopyButtonClick = this.createTouchClickEvent(this.btnAddCopy, this.addCopyButtonClick);
            this.DeleteButtonClick = this.createTouchClickEvent(this.btnDelete, this.deleteButtonClick);
            this.CloseButtonClick = this.createTouchClickEvent(this.btnClose, this.closeButtonClick);
            this.SelectButtonClick = this.createTouchClickEvent(this.btnSelect, this.selectButtonClick);
            if (this.cardSettings && this.cardSettings.FilterSettings)
                this.cardSettings.FilterSettings.createEvents();
        }

        protected destroyEvents(): void {
            if (this.cardSettings && this.cardSettings.FilterSettings)
                this.cardSettings.FilterSettings.destroyEvents();
            if (this.rows) {
                this.destroyTouchClickEvent(this.rows, this.rowClick);
                this.destroyDblTouchClickEvent(this.rows, this.rowDblClick);
            }
            this.destroyTouchClickEvent(this.btnSelect, this.SelectButtonClick);
            this.destroyTouchClickEvent(this.btnEdit, this.EditButtonClick);
            this.destroyTouchClickEvent(this.btnAdd, this.AddButtonClick);
            this.destroyTouchClickEvent(this.btnAddCopy, this.AddCopyButtonClick);
            this.destroyTouchClickEvent(this.btnDelete, this.DeleteButtonClick);
            this.destroyTouchClickEvent(this.btnClose, this.CloseButtonClick);
        }

        protected createCardFilterSettings(): Interfaces.Control.ICardFilterSettings {
            return new ctrl.Control.BaseCardFilterSettings($.proxy(this.setupRows, this));
        }

        protected createCardSettings(): Interfaces.Control.ICardSettings {
            return { FilterSettings: this.createCardFilterSettings(), ValueIdNew: 0, EditIdName: "", IsAdd: false, IsAddCopy: false, IsEdit: false, IsDelete: false, IsSelect: false, EditController: "", Load: undefined, Delete: undefined, Columns: [] };
        }


        private rows: JQuery;
        private setupTable(): void {
            this.tableHead.html(this.getTableHeaderHtml());
            this.setupRows();

        }

        protected setupRows(): void {
            this.selectedRow = null;

            if (this.rows) {
                this.destroyTouchClickEvent(this.rows, this.rowClick);
                this.destroyDblTouchClickEvent(this.rows, this.rowDblClick);
            }


            this.tableBody.html(this.getTableBodyHtml());
            this.rows = this.tableBody.find('tr');
            this.rows = this.tableBody.find('tr');
            if (this.rows) {
                this.createTouchClickEvent(this.rows, this.rowClick);
                this.createDblTouchClickEvent(this.rows, this.rowDblClick);
            }
        }


        protected getTableHeaderHtml(): string {
            let columns: Interfaces.Control.IBaseColumn[] = this.CardSettings.Columns;
            let html: string = '';

            html += '<tr>';
            for (let i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
                html += '   <th';
                if (columns[i].HeaderStyle) {
                    html += ' class="';
                    html += columns[i].HeaderStyle;
                    html += '"';
                }
                html += '>';
                html += (columns[i].HeaderTemplate ? columns[i].HeaderTemplate : columns[i].Header);
                html += '</th>';
            }
            html += '</tr>';

            return html;
        }

        protected getTableRowTemplate(): string {
            let setting: Interfaces.Control.ICardSettings = this.CardSettings;
            let columns: Interfaces.Control.IBaseColumn[] = setting.Columns;
            let html: string = '';

            html += '<tr';
            if (setting.FieldId) {
                html += ' id="table-row-#=';
                html += setting.FieldId;
                html += '#"';
            }
            html += '>';

            for (let i = 0, icount = (columns && columns.length ? columns.length : 0); i < icount; i++) {
                html += '   <td';
                if (columns[i].FieldStyle) {
                    html += ' class="';
                    html += columns[i].FieldStyle;
                    html += '"';
                }
                html += '>';
                if (columns[i].FieldTemplate)
                    html += columns[i].FieldTemplate;
                else {
                    html += '#=';
                    html += columns[i].Field;
                    html += '#';
                }
                html += '</td>';
            }
            html += '</tr>';

            return html;
        }

        protected getTableBodyHtml(): string {
            let html: string = '';
            let data: Interfaces.Model.IEditorModel[] = (this.cardSettings && this.cardSettings.FilterSettings ? this.cardSettings.FilterSettings.GetItemsForView(this.Model.get("cardModel")) : this.Model.get("cardModel"));

            if (data && data.length > 0) {
                let templateRow = vars.getTemplate(this.getTableRowTemplate());
                if (templateRow) {
                    for (let i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                        html += templateRow(data[i]);
                    }
                }
            }
            return html;
        }

        private selectedRow: JQuery;
        private rowClick(e): void {
            if (this.selectedRow)
                this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
            this.selectedRow = $(e.currentTarget);
            if (this.selectedRow)
                this.selectedRow.addClass("row-active z-depth-1 brown lighten-5");
        }

        private rowDblClick(e): void {
            if (this.selectedRow)
                this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
            this.selectedRow = $(e.currentTarget);
            if (this.selectedRow)
                this.selectedRow.addClass("row-active z-depth-1 brown lighten-5");
            if (this.CardSettings.IsSelect)
                this.selectButtonClick(e);
            else
                this.editButtonClick(e);
        }

        public EditButtonClick: { (e: any): void; };
        private editButtonClick(e): void {
            if (this.selectedRow) {
                this.Edit();
            }
        }

        public getSelectedRowId(): any {
            if (this.selectedRow && this.selectedRow.length > 0 && this.selectedRow[0].id) {
                return this.selectedRow[0].id.replace("table-row-", "");
            }
        }

        public getSelectedRecord(): Interfaces.Model.IBaseModel {
            let result: Interfaces.Model.IBaseModel;
            let id: any = this.getSelectedRowId();
            if (id) {
                let _id: number = +id;
                let data: Interfaces.Model.IBaseModel[] = this.Model.get("cardModel");
                for (let i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                    if (data[i].Id == _id) {
                        result = data[i];
                        break;
                    }
                }
            }
            return result;
        }

        public AddButtonClick: { (e: any): void; };
        private addButtonClick(e): void {
            this.Add();
        }

        public AddCopyButtonClick: { (e: any): void; };
        private addCopyButtonClick(e): void {
            this.addCopy();
        }

        public DeleteButtonClick: { (e: any): void; };
        private deleteButtonClick(e): void {
            this.Delete();
        }

        public OnSelect: { (controller: Interfaces.IControllerCard): void; };
        public SelectButtonClick: { (e: any): void; };
        private selectButtonClick(e): void {
            let self: any = this;
            if (this.OnSelect)
                this.OnSelect(self as Interfaces.IControllerCard);
            this.Close();
            vars._main.ControllerBack(e);
        }

        public CloseButtonClick: { (e: any): void; };
        private closeButtonClick(e): void {
            this.Close();
            vars._main.ControllerBack(e);
        }

        protected loadData(): boolean {
            let controller = this;
            if (this.CardSettings && this.CardSettings.Load) {
                this.CardSettings.Load((responseData) => {
                    controller.Model.set("cardModel", responseData.Data);
                    controller.afterLoad();
                });
                return false;
            }
            controller.afterLoad();
            return true;
        }

        protected afterLoad(): void {
            this.setupTable();
            vars._app.HideLoading();
        }

        public Add(): void {
            vars._editorData[this.CardSettings.EditIdName] = this.CardSettings.ValueIdNew;
            vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
        }

        protected afterAdd(): void {

        }


        public addCopy(): void {
            let id: any = this.getSelectedRowId();
            if (id) {
                let _id: number = +id;
                if (_id > 0) {
                    vars._editorData[this.CardSettings.EditIdName] = _id;
                    vars._editorData["isCopy"] = true;
                    vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
                }
            }
        }


        public Edit(): void {
            let id: any = this.getSelectedRowId();
            if (id) {
                let _id: number = +id;
                if (_id > 0) {
                    vars._editorData[this.CardSettings.EditIdName] = _id;
                    vars._editorData["isCopy"] = false;
                    vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
                }
            }
        }

        public Delete(): void {
            let id: any = this.getSelectedRowId();
            if (id) {
                let _id: number = +id;
                let controller = this;
                if (this.CardSettings && this.CardSettings.Delete) {
                    this.CardSettings.Delete(_id, (responseData) => {
                        controller.afterDelete();
                    });
                }
            }
        }


        protected afterDelete(): void {
            let id: any = this.getSelectedRowId();
            if (id) {
                let _id: number = +id;
                let model: any[] = this.Model.get("cardModel");
                for (let i = model.length - 1; i >= 0; i--) {
                    if (model[i].id === _id) {
                        model.splice(i, 1);
                    }
                }
                this.setupRows();
            }
        }

        public Close(): void {
        }
    }

    export class BaseReportWithFilter extends BaseEditor implements Interfaces.IControllerReportWithFilter {

        constructor() {
            super();
            if (this.EditorSettings && this.EditorSettings.ButtonSetings)
                this.EditorSettings.ButtonSetings.IsSave = false;
            this.RestoreFilter();
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "filterModel": {},
            });
        }

        protected get FilterName(): string {
            return "reportFilter";
        }

        public SaveFilter(): void {
            window.localStorage.setItem(this.FilterName, this.getSaveFilter());
        }

        protected getSaveFilter(): string {
            return JSON.stringify(this.Filter);
        }

        public RestoreFilter(): void {
            let filter: Interfaces.Model.IReportFilter;
            let saved: any = window.localStorage.getItem(this.FilterName);
            if (!saved || saved === "\"{}\"") {
                filter = this.getDefaultFilter();
            }
            else
                filter = JSON.parse(saved);
            this.Model.set("filterModel", filter);
            // this.Filter = filter;
        }

        protected getDefaultFilter(): Interfaces.Model.IReportFilter {
            return { datefrom: utils.date_ddmmyyyy(utils.dateToday()), dateto: utils.date_ddmmyyyy(utils.dateToday()) };
        }

        public get Filter(): Interfaces.Model.IReportFilter {
            return this.Model.get("filterModel").toJSON() as Interfaces.Model.IReportFilter;
        }

        public set Filter(filter: Interfaces.Model.IReportFilter) {
            this.Model.set("filterModel", filter);
        }

        public ViewHide(e: any) {
            this.SaveFilter();
            super.ViewHide(e);
        }
    }

    export class BaseReportTable extends BaseReportWithFilter implements Interfaces.IControllerReport {

        constructor() {
            super();
        }

        public get Columns(): Interfaces.Control.ITableColumn[] {
            let columns: Interfaces.Control.ITableColumn[] = [];
            return columns;
        }

        private tableControl: Interfaces.Control.IControlTable;
        public get Table(): Interfaces.Control.IControlTable {
            return this.tableControl;
        }

        public set Table(table: Interfaces.Control.IControlTable) {
            this.tableControl = table;
        }

        public ViewInit(view: JQuery): boolean {
            let result: boolean = super.ViewInit(view);
            let controls: Array<JQuery> = [];
            controls.push(this.initializeTableRow());
            view.append(controls);

            this.SetupTable();
            return result;
        }

        protected SetupTable(rows?: Interfaces.Model.ITableRowModel[]) {
            this.tableControl.Rows = rows;
            this.tableControl.Columns = this.Columns;
            this.tableControl.Setup();
        }

        protected OnDetalize(row: Interfaces.Model.ITableRowModel) {

        }

        protected initializeTableRow(): JQuery {
            if (!this.tableControl)
                this.tableControl = new ctrl.Control.BaseTable();

            this.tableControl.OnDetalize = $.proxy(this.OnDetalize, this);

            let tableRow: JQuery = $('<div class="row row-table-report"></div>');
            let tableCol: JQuery = $('<div class="col s12 m12 l12 xl12 col-table"></div>');
            tableCol.append(this.tableControl.InitView());
            tableRow.append(tableCol);
            return tableRow;
        }

        public ViewResize(e: any): void {
            super.ViewResize(e);
            let tbody: JQuery = (this.tableControl ? this.tableControl.TableBody : undefined);
            if (tbody && tbody.length > 0) {
                tbody.height($(window).height() - tbody.offset().top - (0.2 * parseFloat(getComputedStyle(tbody[0]).fontSize)) - 1);
            }
        }

        public ViewShow(e): boolean {
            return super.ViewShow(e);
        }

        public ViewHide(e: any) {
            this.tableControl.DestroyView();
            super.ViewHide(e);
        }

        protected destroyEvents() {
            super.destroyEvents();
        }

        protected buildButtonClick(e) {
            this.SetupTable([]);
        }
    }
}
