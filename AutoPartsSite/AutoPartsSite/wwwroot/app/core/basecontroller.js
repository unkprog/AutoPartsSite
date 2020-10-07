define(["require", "exports", "app/core/utils", "app/core/variables", "app/core/basecontrol"], function (require, exports, utils, vars, ctrl) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        class Base {
            constructor() {
                this._options = this.createOptions();
                this._model = this.createModel();
            }
            createOptions() {
                return {
                    Url: "",
                    Id: ""
                };
            }
            get Options() {
                return this._options;
            }
            createModel() {
                return new kendo.data.ObservableObject({
                    "Header": ""
                });
            }
            get Model() {
                return this._model;
            }
            get View() {
                return this._view;
            }
            get Header() { return this._model ? this._model.get("Header") : ""; }
            set Header(value) { if (this._model)
                this._model.set("Header", value); }
            ViewInit(view) {
                this._view = view;
                kendo.bind(view, this._model);
                this.OnViewInit();
                this.createEvents();
                return true;
            }
            OnViewInit() {
            }
            createEvents() {
            }
            ViewShow(e) {
                M.updateTextFields();
                return true;
            }
            //public AfterShow(e: any): void {
            //}
            ViewHide(e) {
                this.destroyEvents();
            }
            destroyEvents() {
            }
            ViewResize(e) {
            }
            createTouchClickEvent(elemName, clickFunc) {
                return utils.createTouchClickEvent(elemName, clickFunc, this, this.View);
            }
            createDblTouchClickEvent(elemName, clickFunc) {
                return utils.createDblTouchClickEvent(elemName, clickFunc, this, this.View);
            }
            createClickEvent(elemName, clickFunc) {
                return utils.createClickEvent(elemName, clickFunc, this, this.View);
            }
            createKeyPress(elemName, clickFunc, controller) {
                var result = $.proxy(clickFunc, controller);
                $.each(elemName, function (index, el) {
                    var $inp = $("#" + el);
                    if ($inp.length > 0) {
                        $inp[0].addEventListener("keypress", result, false);
                    }
                });
                return result;
            }
            destroyTouchClickEvent(elemName, proxyFunc) {
                utils.destroyTouchClickEvent(elemName, proxyFunc, this.View);
            }
            destroyDblTouchClickEvent(elemName, proxyFunc) {
                utils.destroyDblTouchClickEvent(elemName, proxyFunc, this.View);
            }
            destroyClickEvent(elemName, proxyFunc) {
                utils.destroyClickEvent(elemName, proxyFunc, this.View);
            }
            deleteKeyPress(elemName, proxyFunc) {
                $.each(elemName, function (index, el) {
                    var $inp = $("#" + el);
                    if ($inp.length > 0)
                        $inp[0].removeEventListener("keypress", proxyFunc);
                });
            }
        }
        Controller.Base = Base;
        class ControllersStack {
            constructor() {
                this._controllers = [];
            }
            get Current() {
                return this._current;
            }
            get Last() {
                return (this._controllers.length > 0 ? this._controllers[this._controllers.length - 1] : undefined);
            }
            Pop() {
                if (this._controllers.length > 0)
                    this._current = this._controllers.pop();
                else
                    this._current = undefined;
            }
            Push(controller) {
                var self = this;
                if (controller) {
                    self._controllers.push(controller);
                    history.pushState({}, '');
                }
                else
                    self._controllers = [];
            }
        }
        Controller.ControllersStack = ControllersStack;
        class BaseContent extends Base {
            constructor() {
                super();
                this._controllersStack = new ControllersStack();
                this.ControllerBack = $.proxy(this.controllerBack, this);
                this._controllers = this.ControllersInit();
            }
            ControllersInit() {
                return {};
            }
            GetContent() {
                return this._content;
            }
            ViewInit(view) {
                let result = super.ViewInit(view);
                this._content = this.GetContent();
                return result;
            }
            ViewShow(e) {
                let result = super.ViewShow(e);
                if (this._controller)
                    this._controller.ViewShow(e);
                return result;
            }
            ResetScroll() {
                this._content.scrollTop(0);
            }
            ViewResize(e) {
                if (this._content) {
                    let heigth = window.innerHeight;
                    heigth = heigth - this._content.offset().top;
                    this._content.height(heigth);
                }
                if (this._controller)
                    this._controller.ViewResize(e);
            }
            controllerBack(e) {
                if (vars._app.IsModal)
                    vars._app.ControllerBack(e);
                else {
                    this._controllersStack.Pop();
                    this.RestoreController();
                }
            }
            RestoreController() {
                if (this._controllersStack.Current)
                    this.OpenView({ controller: this._controllersStack.Current, isRestore: true });
            }
            OpenController(options) {
                vars._app.OpenController(options);
            }
            OpenView(options) {
                var self = this;
                if (options.isModal && options.isModal === true) {
                    vars._app.OpenView(options);
                    return;
                }
                if ($("#" + options.controller.Options.Id).length > 0)
                    return; //Already loaded and current
                vars._app.ShowLoading();
                $.when($.ajax({ url: options.controller.Options.Url, cache: false })).done((template) => {
                    self.OpenViewTemplate({ controller: options.controller, template: template, backController: options.backController, isRestore: options.isRestore });
                }).fail((e) => {
                    vars._app.HideLoading();
                });
            }
            OpenViewTemplate(options) {
                let self = this;
                //if (options.isModal && options.isModal === true) {
                //    _app.OpenViewTemplate(options);
                //    return;
                //}
                let isInit = false;
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
                        let view = $(options.template);
                        isInit = self._controller.ViewInit(view);
                        self.ResetScroll();
                        self._content.html(view[0]);
                        isInit = self._controller.ViewShow(self) && isInit;
                        self._controller.ViewResize(self);
                    }
                    catch (ex) {
                        console.log(ex);
                    }
                }
                finally {
                    if (isInit)
                        vars._app.HideLoading();
                }
            }
            SetHeader(controller) {
                //TODO: Пока не заморачиваемся с заголовком
                //let header = controller.Header;
                //if (header)
                //    self._model.set("AppHeader", header); // + ' ' + self.contentControl.width()
                //else
                //    if ("POS Cloud" !== self._model.get("AppHeader"))
                //        self._model.set("AppHeader", "POS Cloud");
            }
        }
        Controller.BaseContent = BaseContent;
        class BaseEditor extends Base {
            constructor() {
                super();
                this.editorSettings = this.createEditorSettings();
                if (!this.editorSettings.ButtonSetings)
                    this.editorSettings.ButtonSetings = { IsSave: true, IsCancel: true };
            }
            createModel() {
                return new kendo.data.ObservableObject({
                    "Header": "",
                    "editModel": {},
                });
            }
            get EditorModel() {
                return this.Model.get("editModel").toJSON();
            }
            get EditorSettings() {
                return this.editorSettings;
            }
            createEditorSettings() {
                return { EditIdName: "", Load: undefined, Save: undefined };
            }
            get EditorHeader() {
                return (this.editorSettings.ButtonSetings.IsSave === true || this.editorSettings.ButtonSetings.IsCancel === true ? this.navHeader : undefined);
            }
            ViewInit(view) {
                let navbarHeader = '<div class="navbar-fixed editor-header">';
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
                let editButtons = this.navHeader.find("#editButtons");
                if (this.editorSettings.ButtonSetings.IsPrint === true)
                    editButtons.append(this.btnPrint);
                if (this.editorSettings.ButtonSetings.IsSave === true)
                    editButtons.append(this.btnSave);
                if (this.editorSettings.ButtonSetings.IsCancel === true)
                    editButtons.append(this.btnCancel);
                if (this.editorSettings.ButtonSetings.IsSave === true || this.editorSettings.ButtonSetings.IsCancel === true)
                    view.prepend(this.navHeader);
                this.tooltips = this.navHeader.find(".tooltipped");
                super.ViewInit(view);
                return this.loadData();
            }
            ViewShow(e) {
                if (this.tooltips)
                    this.tooltips.tooltip();
                return super.ViewShow(e);
            }
            ViewHide(e) {
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
            createEvents() {
                this.PrintButtonClick = this.createTouchClickEvent(this.btnPrint, this.printButtonClick);
                this.SaveButtonClick = this.createTouchClickEvent(this.btnSave, this.saveButtonClick);
                this.CancelButtonClick = this.createTouchClickEvent(this.btnCancel, this.cancelButtonClick);
            }
            destroyEvents() {
                this.destroyTouchClickEvent(this.btnPrint, this.PrintButtonClick);
                this.destroyTouchClickEvent(this.btnSave, this.SaveButtonClick);
                this.destroyTouchClickEvent(this.btnCancel, this.CancelButtonClick);
            }
            printButtonClick(e) {
                this.Print();
            }
            saveButtonClick(e) {
                if (this.validate()) {
                    this.Save();
                }
            }
            cancelButtonClick(e) {
                this.Cancel();
                vars._main.ControllerBack(e);
            }
            loadData() {
                let controller = this;
                if (controller.EditorSettings && controller.EditorSettings.Load) {
                    let id = (vars._editorData[controller.EditorSettings.EditIdName] ? vars._editorData[controller.EditorSettings.EditIdName] : 0);
                    controller.EditorSettings.Load(id, (responseData) => {
                        if (vars._editorData.isCopy === true)
                            responseData.record.id = 0;
                        controller.Model.set("editModel", responseData.record);
                        controller.afterLoad(responseData);
                        controller.endLoad();
                    });
                    return false;
                }
                controller.afterLoad();
                controller.endLoad();
                return true;
            }
            afterLoad(responseData) {
            }
            endLoad() {
                M.updateTextFields();
                vars._app.HideLoading();
                this.View.show();
            }
            validate() {
                return true;
            }
            endSave() {
                vars._main.ControllerBack(this);
            }
            getSaveModel() {
                return this.EditorModel;
            }
            Print() {
            }
            Save() {
                let controller = this;
                if (controller.EditorSettings && controller.EditorSettings.Save) {
                    let model = controller.getSaveModel();
                    controller.EditorSettings.Save(model, (responseData) => {
                        controller.endSave();
                    });
                    return;
                }
                controller.endSave();
            }
            Cancel() {
            }
        }
        Controller.BaseEditor = BaseEditor;
        class BaseCard extends Base {
            constructor() {
                super();
                this.cardSettings = this.createCardSettings();
            }
            createModel() {
                return new kendo.data.ObservableObject({
                    "Header": "",
                    "cardModel": [],
                });
            }
            get CardModel() {
                return this.Model.get("cardModel").toJSON();
            }
            get CardSettings() {
                return this.cardSettings;
            }
            ViewInit(view) {
                let controls = [];
                controls.push(this.initNavHeader());
                let filterControl = (this.cardSettings && this.cardSettings.FilterSettings ? this.cardSettings.FilterSettings.InitControls() : undefined);
                if (filterControl)
                    controls.push(filterControl);
                controls.push(this.initializeTableRow());
                view.append(controls);
                super.ViewInit(view);
                return this.loadData();
            }
            initNavHeader() {
                let navbarHeader = '<div class="navbar-fixed editor-header">';
                navbarHeader += '        <nav class="editor-header-nav">';
                navbarHeader += '            <div class="nav-wrapper editor-header">';
                navbarHeader += '                <a class="editor-header-title">' + this.Header + '</a>';
                navbarHeader += '                <ul id="cardButtons" class="right"></ul>';
                navbarHeader += '            </div>';
                navbarHeader += '        </nav>';
                navbarHeader += '    </div>';
                this.navHeader = $(navbarHeader);
                if (this.CardSettings.IsEdit)
                    this.btnEdit = $('<li><a id="card-btn-edit" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$edit") + '"><i class="material-icons editor-header">edit</i></a></li>');
                if (this.CardSettings.IsAdd)
                    this.btnAdd = $('<li><a id="card-btn-add" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$add") + '"><i class="material-icons editor-header">add</i></a></li>');
                if (this.CardSettings.IsAddCopy)
                    this.btnAddCopy = $('<li><a id="card-btn-addcopy" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$addcopy") + '"><i class="material-icons editor-header">exposure_plus_1</i></a></li>');
                if (this.CardSettings.IsDelete)
                    this.btnDelete = $('<li><a id="card-btn-delete" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$delete") + '"><i class="material-icons editor-header">delete_forever</i></a></li>');
                if (this.CardSettings.IsSelect)
                    this.btnSelect = $('<li><a id="editor-btn-select" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$select") + '"><i class="material-icons editor-header">done</i></a></li>');
                this.btnClose = $('<li><a id="card-btn-close" class="editor-header-button tooltipped" data-position="bottom" data-tooltip="' + vars._statres("button$label$cancel") + '"><i class="material-icons editor-header">close</i></a></li>');
                let cardButtons = this.navHeader.find("#cardButtons");
                cardButtons.append(this.btnEdit).append(this.btnAdd).append(this.btnAddCopy).append(this.btnDelete).append(this.btnSelect).append(this.btnClose);
                this.tooltips = cardButtons.find(".tooltipped");
                return this.navHeader;
            }
            initializeTableRow() {
                let navbarHeader = '<div class="row row-table">';
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
            ViewResize(e) {
                super.ViewResize(e);
                if (this.cardSettings && this.cardSettings.FilterSettings)
                    this.cardSettings.FilterSettings.ResizeControls();
                let tbody = this.tableBody;
                if (tbody && tbody.length > 0) {
                    tbody.height($(window).height() - tbody.offset().top - tbody.parent().parent().parent().parent().parent().scrollTop() - (0.2 * parseFloat(getComputedStyle(tbody[0]).fontSize)) - 1);
                }
            }
            ViewShow(e) {
                if (this.cardSettings && this.cardSettings.FilterSettings)
                    this.cardSettings.FilterSettings.ViewControls();
                if (this.tooltips)
                    this.tooltips.tooltip();
                return super.ViewShow(e);
            }
            ViewHide(e) {
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
            createEvents() {
                this.EditButtonClick = this.createTouchClickEvent(this.btnEdit, this.editButtonClick);
                this.AddButtonClick = this.createTouchClickEvent(this.btnAdd, this.addButtonClick);
                this.AddCopyButtonClick = this.createTouchClickEvent(this.btnAddCopy, this.addCopyButtonClick);
                this.DeleteButtonClick = this.createTouchClickEvent(this.btnDelete, this.deleteButtonClick);
                this.CloseButtonClick = this.createTouchClickEvent(this.btnClose, this.closeButtonClick);
                this.SelectButtonClick = this.createTouchClickEvent(this.btnSelect, this.selectButtonClick);
                if (this.cardSettings && this.cardSettings.FilterSettings)
                    this.cardSettings.FilterSettings.createEvents();
            }
            destroyEvents() {
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
            createCardFilterSettings() {
                return new ctrl.Control.BaseCardFilterSettings($.proxy(this.setupRows, this));
            }
            createCardSettings() {
                return { FilterSettings: this.createCardFilterSettings(), ValueIdNew: 0, EditIdName: "", IsAdd: false, IsAddCopy: false, IsEdit: false, IsDelete: false, IsSelect: false, EditController: "", Load: undefined, Delete: undefined, Columns: [] };
            }
            setupTable() {
                this.tableHead.html(this.getTableHeaderHtml());
                this.setupRows();
            }
            setupRows() {
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
            getTableHeaderHtml() {
                let columns = this.CardSettings.Columns;
                let html = '';
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
            getTableRowTemplate() {
                let setting = this.CardSettings;
                let columns = setting.Columns;
                let html = '';
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
            getTableBodyHtml() {
                let html = '';
                let data = (this.cardSettings && this.cardSettings.FilterSettings ? this.cardSettings.FilterSettings.GetItemsForView(this.Model.get("cardModel")) : this.Model.get("cardModel"));
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
            rowClick(e) {
                if (this.selectedRow)
                    this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
                this.selectedRow = $(e.currentTarget);
                if (this.selectedRow)
                    this.selectedRow.addClass("row-active z-depth-1 brown lighten-5");
            }
            rowDblClick(e) {
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
            editButtonClick(e) {
                if (this.selectedRow) {
                    this.Edit();
                }
            }
            getSelectedRowId() {
                if (this.selectedRow && this.selectedRow.length > 0 && this.selectedRow[0].id) {
                    return this.selectedRow[0].id.replace("table-row-", "");
                }
            }
            getSelectedRecord() {
                let result;
                let id = this.getSelectedRowId();
                if (id) {
                    let _id = +id;
                    let data = this.Model.get("cardModel");
                    for (let i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                        if (data[i].Id == _id) {
                            result = data[i];
                            break;
                        }
                    }
                }
                return result;
            }
            addButtonClick(e) {
                this.Add();
            }
            addCopyButtonClick(e) {
                this.addCopy();
            }
            deleteButtonClick(e) {
                this.Delete();
            }
            selectButtonClick(e) {
                let self = this;
                if (this.OnSelect)
                    this.OnSelect(self);
                this.Close();
                vars._main.ControllerBack(e);
            }
            closeButtonClick(e) {
                this.Close();
                vars._main.ControllerBack(e);
            }
            loadData() {
                let controller = this;
                if (this.CardSettings && this.CardSettings.Load) {
                    this.CardSettings.Load((responseData) => {
                        controller.Model.set("cardModel", responseData);
                        controller.afterLoad();
                    });
                    return false;
                }
                controller.afterLoad();
                return true;
            }
            afterLoad() {
                this.setupTable();
                vars._app.HideLoading();
            }
            Add() {
                vars._editorData[this.CardSettings.EditIdName] = this.CardSettings.ValueIdNew;
                vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
            }
            afterAdd() {
            }
            addCopy() {
                let id = this.getSelectedRowId();
                if (id) {
                    let _id = +id;
                    if (_id > 0) {
                        vars._editorData[this.CardSettings.EditIdName] = _id;
                        vars._editorData["isCopy"] = true;
                        vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
                    }
                }
            }
            Edit() {
                let id = this.getSelectedRowId();
                if (id) {
                    let _id = +id;
                    if (_id > 0) {
                        vars._editorData[this.CardSettings.EditIdName] = _id;
                        vars._editorData["isCopy"] = false;
                        vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
                    }
                }
            }
            Delete() {
                let id = this.getSelectedRowId();
                if (id) {
                    let _id = +id;
                    let controller = this;
                    if (this.CardSettings && this.CardSettings.Delete) {
                        this.CardSettings.Delete(_id, (responseData) => {
                            controller.afterDelete();
                        });
                    }
                }
            }
            afterDelete() {
                let id = this.getSelectedRowId();
                if (id) {
                    let _id = +id;
                    let model = this.Model.get("cardModel");
                    for (let i = model.length - 1; i >= 0; i--) {
                        if (model[i].id === _id) {
                            model.splice(i, 1);
                        }
                    }
                    this.setupRows();
                }
            }
            Close() {
            }
        }
        Controller.BaseCard = BaseCard;
        class BaseReportWithFilter extends BaseEditor {
            constructor() {
                super();
                if (this.EditorSettings && this.EditorSettings.ButtonSetings)
                    this.EditorSettings.ButtonSetings.IsSave = false;
                this.RestoreFilter();
            }
            createModel() {
                return new kendo.data.ObservableObject({
                    "Header": "",
                    "filterModel": {},
                });
            }
            get FilterName() {
                return "reportFilter";
            }
            SaveFilter() {
                window.localStorage.setItem(this.FilterName, this.getSaveFilter());
            }
            getSaveFilter() {
                return JSON.stringify(this.Filter);
            }
            RestoreFilter() {
                let filter;
                let saved = window.localStorage.getItem(this.FilterName);
                if (!saved || saved === "\"{}\"") {
                    filter = this.getDefaultFilter();
                }
                else
                    filter = JSON.parse(saved);
                this.Model.set("filterModel", filter);
                // this.Filter = filter;
            }
            getDefaultFilter() {
                return { datefrom: utils.date_ddmmyyyy(utils.dateToday()), dateto: utils.date_ddmmyyyy(utils.dateToday()) };
            }
            get Filter() {
                return this.Model.get("filterModel").toJSON();
            }
            set Filter(filter) {
                this.Model.set("filterModel", filter);
            }
            ViewHide(e) {
                this.SaveFilter();
                super.ViewHide(e);
            }
        }
        Controller.BaseReportWithFilter = BaseReportWithFilter;
        class BaseReportTable extends BaseReportWithFilter {
            constructor() {
                super();
            }
            get Columns() {
                let columns = [];
                return columns;
            }
            get Table() {
                return this.tableControl;
            }
            set Table(table) {
                this.tableControl = table;
            }
            ViewInit(view) {
                let result = super.ViewInit(view);
                let controls = [];
                controls.push(this.initializeTableRow());
                view.append(controls);
                this.SetupTable();
                return result;
            }
            SetupTable(rows) {
                this.tableControl.Rows = rows;
                this.tableControl.Columns = this.Columns;
                this.tableControl.Setup();
            }
            OnDetalize(row) {
            }
            initializeTableRow() {
                if (!this.tableControl)
                    this.tableControl = new ctrl.Control.BaseTable();
                this.tableControl.OnDetalize = $.proxy(this.OnDetalize, this);
                let tableRow = $('<div class="row row-table-report"></div>');
                let tableCol = $('<div class="col s12 m12 l12 xl12 col-table"></div>');
                tableCol.append(this.tableControl.InitView());
                tableRow.append(tableCol);
                return tableRow;
            }
            ViewResize(e) {
                super.ViewResize(e);
                let tbody = (this.tableControl ? this.tableControl.TableBody : undefined);
                if (tbody && tbody.length > 0) {
                    tbody.height($(window).height() - tbody.offset().top - (0.2 * parseFloat(getComputedStyle(tbody[0]).fontSize)) - 1);
                }
            }
            ViewShow(e) {
                return super.ViewShow(e);
            }
            ViewHide(e) {
                this.tableControl.DestroyView();
                super.ViewHide(e);
            }
            destroyEvents() {
                super.destroyEvents();
            }
            buildButtonClick(e) {
                this.SetupTable([]);
            }
        }
        Controller.BaseReportTable = BaseReportTable;
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=basecontroller.js.map