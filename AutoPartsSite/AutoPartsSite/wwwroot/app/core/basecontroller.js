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
define(["require", "exports", "app/core/utils", "app/core/variables", "app/core/basecontrol"], function (require, exports, utils, vars, ctrl) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Base = (function () {
            function Base() {
                this._options = this.createOptions();
                this._model = this.createModel();
            }
            Base.prototype.createOptions = function () {
                return {
                    Url: "",
                    Id: ""
                };
            };
            Object.defineProperty(Base.prototype, "Options", {
                get: function () {
                    return this._options;
                },
                enumerable: false,
                configurable: true
            });
            Base.prototype.createModel = function () {
                return new kendo.data.ObservableObject({
                    "Header": ""
                });
            };
            Object.defineProperty(Base.prototype, "Model", {
                get: function () {
                    return this._model;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Base.prototype, "View", {
                get: function () {
                    return this._view;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(Base.prototype, "Header", {
                get: function () { return this._model ? this._model.get("Header") : ""; },
                set: function (value) { if (this._model)
                    this._model.set("Header", value); },
                enumerable: false,
                configurable: true
            });
            Base.prototype.ViewInit = function (view) {
                this._view = view;
                kendo.bind(view, this._model);
                this.OnViewInit();
                this.createEvents();
                return true;
            };
            Base.prototype.rebindModel = function () {
                kendo.unbind(this._view, this._model);
                kendo.bind(this._view, this._model);
            };
            Base.prototype.OnViewInit = function () {
            };
            Base.prototype.createEvents = function () {
            };
            Base.prototype.ViewShow = function (e) {
                M.updateTextFields();
                return true;
            };
            Base.prototype.ViewHide = function (e) {
                this.destroyEvents();
            };
            Base.prototype.destroyEvents = function () {
            };
            Base.prototype.ViewResize = function (e) {
            };
            Base.prototype.createTouchClickEvent = function (elemName, clickFunc) {
                return utils.createTouchClickEvent(elemName, clickFunc, this, this.View);
            };
            Base.prototype.createDblTouchClickEvent = function (elemName, clickFunc) {
                return utils.createDblTouchClickEvent(elemName, clickFunc, this, this.View);
            };
            Base.prototype.createClickEvent = function (elemName, clickFunc) {
                return utils.createClickEvent(elemName, clickFunc, this, this.View);
            };
            Base.prototype.createKeyPress = function (elemName, clickFunc, controller) {
                var result = $.proxy(clickFunc, controller);
                $.each(elemName, function (index, el) {
                    var $inp = $("#" + el);
                    if ($inp.length > 0) {
                        $inp[0].addEventListener("keypress", result, false);
                    }
                });
                return result;
            };
            Base.prototype.destroyTouchClickEvent = function (elemName, proxyFunc) {
                utils.destroyTouchClickEvent(elemName, proxyFunc, this.View);
            };
            Base.prototype.destroyDblTouchClickEvent = function (elemName, proxyFunc) {
                utils.destroyDblTouchClickEvent(elemName, proxyFunc, this.View);
            };
            Base.prototype.destroyClickEvent = function (elemName, proxyFunc) {
                utils.destroyClickEvent(elemName, proxyFunc, this.View);
            };
            Base.prototype.deleteKeyPress = function (elemName, proxyFunc) {
                $.each(elemName, function (index, el) {
                    var $inp = $("#" + el);
                    if ($inp.length > 0)
                        $inp[0].removeEventListener("keypress", proxyFunc);
                });
            };
            return Base;
        }());
        Controller.Base = Base;
        var ControllersStack = (function () {
            function ControllersStack() {
                this._controllers = [];
            }
            Object.defineProperty(ControllersStack.prototype, "Current", {
                get: function () {
                    return this._current;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(ControllersStack.prototype, "Last", {
                get: function () {
                    return (this._controllers.length > 0 ? this._controllers[this._controllers.length - 1] : undefined);
                },
                enumerable: false,
                configurable: true
            });
            ControllersStack.prototype.Pop = function () {
                if (this._controllers.length > 0)
                    this._current = this._controllers.pop();
                else
                    this._current = undefined;
            };
            ControllersStack.prototype.Push = function (controller) {
                var self = this;
                if (controller) {
                    self._controllers.push(controller);
                    history.pushState({}, '');
                }
                else
                    self._controllers = [];
            };
            return ControllersStack;
        }());
        Controller.ControllersStack = ControllersStack;
        var BaseContent = (function (_super) {
            __extends(BaseContent, _super);
            function BaseContent() {
                var _this = _super.call(this) || this;
                _this._controllersStack = new ControllersStack();
                _this.ControllerBack = $.proxy(_this.controllerBack, _this);
                _this._controllers = _this.ControllersInit();
                return _this;
            }
            BaseContent.prototype.ControllersInit = function () {
                return {};
            };
            BaseContent.prototype.GetContent = function () {
                return this._content;
            };
            BaseContent.prototype.ViewInit = function (view) {
                var result = _super.prototype.ViewInit.call(this, view);
                this._content = this.GetContent();
                return result;
            };
            BaseContent.prototype.ViewShow = function (e) {
                var result = _super.prototype.ViewShow.call(this, e);
                if (this._controller)
                    this._controller.ViewShow(e);
                return result;
            };
            BaseContent.prototype.ResetScroll = function () {
                this._content.scrollTop(0);
            };
            BaseContent.prototype.OnSetViewSize = function (e) {
            };
            BaseContent.prototype.ViewResize = function (e) {
                if (this._content)
                    this.OnSetViewSize(e);
                if (this._controller)
                    this._controller.ViewResize(e);
            };
            BaseContent.prototype.controllerBack = function (e) {
                if (vars._app.IsModal)
                    vars._app.ControllerBack(e);
                else {
                    this._controllersStack.Pop();
                    this.RestoreController();
                }
            };
            BaseContent.prototype.RestoreController = function () {
                if (this._controllersStack.Current)
                    this.OpenView({ controller: this._controllersStack.Current, isRestore: true });
            };
            BaseContent.prototype.OpenController = function (options) {
                vars._app.OpenController(options);
            };
            BaseContent.prototype.OpenView = function (options) {
                var self = this;
                if (options.isModal && options.isModal === true) {
                    vars._app.OpenView(options);
                    return;
                }
                if ($("#" + options.controller.Options.Id).length > 0)
                    return;
                vars._app.ShowLoading(true);
                $.when($.ajax({ url: options.controller.Options.Url })).done(function (template) {
                    self.OpenViewTemplate({ controller: options.controller, template: template, backController: options.backController, isRestore: options.isRestore, isPopState: options.isPopState });
                }).fail(function (e) {
                    vars._app.HideLoading();
                });
            };
            BaseContent.prototype.OpenViewTemplate = function (options) {
                var self = this;
                var isInit = false;
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
                        var view = $(options.template);
                        if (view.length > 0) {
                            for (var i_1 = 0, icount = view.length; i_1 < icount; i_1++) {
                                if (view[i_1] && self._controller.Options.Id === view[i_1].id) {
                                    view = $(view[i_1]);
                                    break;
                                }
                            }
                        }
                        isInit = self._controller.ViewInit(view);
                        self.ResetScroll();
                        var pageOpt = options.controller.Options;
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
                }
                finally {
                    if (isInit)
                        vars._app.HideLoading();
                }
            };
            BaseContent.prototype.SetHeader = function (controller) {
            };
            return BaseContent;
        }(Base));
        Controller.BaseContent = BaseContent;
        var BaseEditor = (function (_super) {
            __extends(BaseEditor, _super);
            function BaseEditor() {
                var _this = _super.call(this) || this;
                _this.editorSettings = _this.createEditorSettings();
                if (!_this.editorSettings.ButtonSetings)
                    _this.editorSettings.ButtonSetings = { IsSave: true, IsCancel: true };
                return _this;
            }
            BaseEditor.prototype.createModel = function () {
                return new kendo.data.ObservableObject({
                    "Header": "",
                    "editModel": {},
                });
            };
            Object.defineProperty(BaseEditor.prototype, "EditorModel", {
                get: function () {
                    return this.Model.get("editModel").toJSON();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseEditor.prototype, "EditorSettings", {
                get: function () {
                    return this.editorSettings;
                },
                enumerable: false,
                configurable: true
            });
            BaseEditor.prototype.createEditorSettings = function () {
                return { EditIdName: this.EditIdName, Load: this.LoadProxy, Save: this.SaveProxy };
            };
            Object.defineProperty(BaseEditor.prototype, "EditIdName", {
                get: function () {
                    return "";
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseEditor.prototype, "LoadProxy", {
                get: function () {
                    return undefined;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseEditor.prototype, "SaveProxy", {
                get: function () {
                    return undefined;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseEditor.prototype, "EditorHeader", {
                get: function () {
                    return (this.editorSettings.ButtonSetings.IsSave === true || this.editorSettings.ButtonSetings.IsCancel === true ? this.navHeader : undefined);
                },
                enumerable: false,
                configurable: true
            });
            BaseEditor.prototype.ViewInit = function (view) {
                var navbarHeader = '<div class="navbar-fixed editor-header">';
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
                var editButtons = this.navHeader.find("#editButtons");
                if (this.editorSettings.ButtonSetings.IsPrint === true)
                    editButtons.append(this.btnPrint);
                if (this.editorSettings.ButtonSetings.IsSave === true)
                    editButtons.append(this.btnSave);
                if (this.editorSettings.ButtonSetings.IsCancel === true)
                    editButtons.append(this.btnCancel);
                if (this.editorSettings.ButtonSetings.IsSave === true || this.editorSettings.ButtonSetings.IsCancel === true)
                    view.prepend(this.navHeader);
                this.tooltips = this.navHeader.find(".tooltipped");
                _super.prototype.ViewInit.call(this, view);
                return this.loadData();
            };
            BaseEditor.prototype.ViewShow = function (e) {
                if (this.tooltips)
                    this.tooltips.tooltip();
                return _super.prototype.ViewShow.call(this, e);
            };
            BaseEditor.prototype.ViewHide = function (e) {
                _super.prototype.ViewHide.call(this, e);
                if (this.btnPrint)
                    this.btnPrint.remove();
                if (this.btnSave)
                    this.btnSave.remove();
                if (this.btnCancel)
                    this.btnCancel.remove();
                if (this.tooltips)
                    this.tooltips.tooltip("destroy");
            };
            BaseEditor.prototype.createEvents = function () {
                this.PrintButtonClick = this.createTouchClickEvent(this.btnPrint, this.printButtonClick);
                this.SaveButtonClick = this.createTouchClickEvent(this.btnSave, this.saveButtonClick);
                this.CancelButtonClick = this.createTouchClickEvent(this.btnCancel, this.cancelButtonClick);
            };
            BaseEditor.prototype.destroyEvents = function () {
                this.destroyTouchClickEvent(this.btnPrint, this.PrintButtonClick);
                this.destroyTouchClickEvent(this.btnSave, this.SaveButtonClick);
                this.destroyTouchClickEvent(this.btnCancel, this.CancelButtonClick);
            };
            BaseEditor.prototype.printButtonClick = function (e) {
                this.Print();
            };
            BaseEditor.prototype.saveButtonClick = function (e) {
                if (this.validate()) {
                    this.Save();
                }
            };
            BaseEditor.prototype.cancelButtonClick = function (e) {
                this.Cancel();
                vars._main.ControllerBack(e);
            };
            BaseEditor.prototype.loadData = function () {
                var controller = this;
                if (controller.EditorSettings && controller.EditorSettings.Load) {
                    var id = (vars._editorData[controller.EditorSettings.EditIdName] ? vars._editorData[controller.EditorSettings.EditIdName] : 0);
                    controller.EditorSettings.Load(id, function (responseData) {
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
            };
            BaseEditor.prototype.afterLoad = function (responseData) {
            };
            BaseEditor.prototype.endLoad = function () {
                M.updateTextFields();
                vars._app.HideLoading();
                this.View.show();
            };
            BaseEditor.prototype.validate = function () {
                return true;
            };
            BaseEditor.prototype.endSave = function () {
                vars._main.ControllerBack(this);
            };
            BaseEditor.prototype.getSaveModel = function () {
                return this.EditorModel;
            };
            BaseEditor.prototype.Print = function () {
            };
            BaseEditor.prototype.Save = function () {
                var controller = this;
                if (controller.EditorSettings && controller.EditorSettings.Save) {
                    var model = controller.getSaveModel();
                    controller.EditorSettings.Save(model, function (responseData) {
                        controller.endSave();
                    });
                    return;
                }
                controller.endSave();
            };
            BaseEditor.prototype.Cancel = function () {
            };
            return BaseEditor;
        }(Base));
        Controller.BaseEditor = BaseEditor;
        var BaseCard = (function (_super) {
            __extends(BaseCard, _super);
            function BaseCard() {
                var _this = _super.call(this) || this;
                _this.cardSettings = _this.createCardSettings();
                return _this;
            }
            BaseCard.prototype.createModel = function () {
                return new kendo.data.ObservableObject({
                    "Header": "",
                    "cardModel": [],
                });
            };
            Object.defineProperty(BaseCard.prototype, "CardModel", {
                get: function () {
                    return this.Model.get("cardModel").toJSON();
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseCard.prototype, "CardSettings", {
                get: function () {
                    return this.cardSettings;
                },
                enumerable: false,
                configurable: true
            });
            BaseCard.prototype.ViewInit = function (view) {
                var controls = [];
                controls.push(this.initNavHeader());
                var filterControl = (this.cardSettings && this.cardSettings.FilterSettings ? this.cardSettings.FilterSettings.InitControls() : undefined);
                if (filterControl)
                    controls.push(filterControl);
                controls.push(this.initializeTableRow());
                view.append(controls);
                _super.prototype.ViewInit.call(this, view);
                return this.loadData();
            };
            BaseCard.prototype.initNavHeader = function () {
                var navbarHeader = '<div class="navbar-fixed editor-header">';
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
                var cardButtons = this.navHeader.find("#cardButtons");
                cardButtons.append(this.btnEdit).append(this.btnAdd).append(this.btnAddCopy).append(this.btnDelete).append(this.btnSelect).append(this.btnClose);
                this.tooltips = cardButtons.find(".tooltipped");
                return this.navHeader;
            };
            BaseCard.prototype.initializeTableRow = function () {
                var navbarHeader = '<div class="row row-table">';
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
            };
            BaseCard.prototype.ViewResize = function (e) {
                _super.prototype.ViewResize.call(this, e);
                if (this.cardSettings && this.cardSettings.FilterSettings)
                    this.cardSettings.FilterSettings.ResizeControls();
                var tbody = this.tableBody;
                if (tbody && tbody.length > 0) {
                    tbody.height($(window).height() - tbody.offset().top - tbody.parent().parent().parent().parent().parent().scrollTop() - (0.2 * parseFloat(getComputedStyle(tbody[0]).fontSize)) - 1);
                }
            };
            BaseCard.prototype.ViewShow = function (e) {
                if (this.cardSettings && this.cardSettings.FilterSettings)
                    this.cardSettings.FilterSettings.ViewControls();
                if (this.tooltips)
                    this.tooltips.tooltip();
                return _super.prototype.ViewShow.call(this, e);
            };
            BaseCard.prototype.ViewHide = function (e) {
                _super.prototype.ViewHide.call(this, e);
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
            };
            BaseCard.prototype.createEvents = function () {
                this.EditButtonClick = this.createTouchClickEvent(this.btnEdit, this.editButtonClick);
                this.AddButtonClick = this.createTouchClickEvent(this.btnAdd, this.addButtonClick);
                this.AddCopyButtonClick = this.createTouchClickEvent(this.btnAddCopy, this.addCopyButtonClick);
                this.DeleteButtonClick = this.createTouchClickEvent(this.btnDelete, this.deleteButtonClick);
                this.CloseButtonClick = this.createTouchClickEvent(this.btnClose, this.closeButtonClick);
                this.SelectButtonClick = this.createTouchClickEvent(this.btnSelect, this.selectButtonClick);
                if (this.cardSettings && this.cardSettings.FilterSettings)
                    this.cardSettings.FilterSettings.createEvents();
            };
            BaseCard.prototype.destroyEvents = function () {
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
            };
            BaseCard.prototype.createCardFilterSettings = function () {
                return new ctrl.Control.BaseCardFilterSettings($.proxy(this.setupRows, this));
            };
            BaseCard.prototype.createCardSettings = function () {
                return { FilterSettings: this.createCardFilterSettings(), ValueIdNew: 0, EditIdName: "", IsAdd: false, IsAddCopy: false, IsEdit: false, IsDelete: false, IsSelect: false, EditController: "", Load: undefined, Delete: undefined, Columns: [] };
            };
            BaseCard.prototype.setupTable = function () {
                this.tableHead.html(this.getTableHeaderHtml());
                this.setupRows();
            };
            BaseCard.prototype.setupRows = function () {
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
            };
            BaseCard.prototype.getTableHeaderHtml = function () {
                var columns = this.CardSettings.Columns;
                var html = '';
                html += '<tr>';
                for (var i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
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
            };
            BaseCard.prototype.getTableRowTemplate = function () {
                var setting = this.CardSettings;
                var columns = setting.Columns;
                var html = '';
                html += '<tr';
                if (setting.FieldId) {
                    html += ' id="table-row-#=';
                    html += setting.FieldId;
                    html += '#"';
                }
                html += '>';
                for (var i = 0, icount = (columns && columns.length ? columns.length : 0); i < icount; i++) {
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
            };
            BaseCard.prototype.getTableBodyHtml = function () {
                var html = '';
                var data = (this.cardSettings && this.cardSettings.FilterSettings ? this.cardSettings.FilterSettings.GetItemsForView(this.Model.get("cardModel")) : this.Model.get("cardModel"));
                if (data && data.length > 0) {
                    var templateRow = vars.getTemplate(this.getTableRowTemplate());
                    if (templateRow) {
                        for (var i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                            html += templateRow(data[i]);
                        }
                    }
                }
                return html;
            };
            BaseCard.prototype.rowClick = function (e) {
                if (this.selectedRow)
                    this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
                this.selectedRow = $(e.currentTarget);
                if (this.selectedRow)
                    this.selectedRow.addClass("row-active z-depth-1 brown lighten-5");
            };
            BaseCard.prototype.rowDblClick = function (e) {
                if (this.selectedRow)
                    this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
                this.selectedRow = $(e.currentTarget);
                if (this.selectedRow)
                    this.selectedRow.addClass("row-active z-depth-1 brown lighten-5");
                if (this.CardSettings.IsSelect)
                    this.selectButtonClick(e);
                else
                    this.editButtonClick(e);
            };
            BaseCard.prototype.editButtonClick = function (e) {
                if (this.selectedRow) {
                    this.Edit();
                }
            };
            BaseCard.prototype.getSelectedRowId = function () {
                if (this.selectedRow && this.selectedRow.length > 0 && this.selectedRow[0].id) {
                    return this.selectedRow[0].id.replace("table-row-", "");
                }
            };
            BaseCard.prototype.getSelectedRecord = function () {
                var result;
                var id = this.getSelectedRowId();
                if (id) {
                    var _id = +id;
                    var data = this.Model.get("cardModel");
                    for (var i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                        if (data[i].Id == _id) {
                            result = data[i];
                            break;
                        }
                    }
                }
                return result;
            };
            BaseCard.prototype.addButtonClick = function (e) {
                this.Add();
            };
            BaseCard.prototype.addCopyButtonClick = function (e) {
                this.addCopy();
            };
            BaseCard.prototype.deleteButtonClick = function (e) {
                this.Delete();
            };
            BaseCard.prototype.selectButtonClick = function (e) {
                var self = this;
                if (this.OnSelect)
                    this.OnSelect(self);
                this.Close();
                vars._main.ControllerBack(e);
            };
            BaseCard.prototype.closeButtonClick = function (e) {
                this.Close();
                vars._main.ControllerBack(e);
            };
            BaseCard.prototype.loadData = function () {
                var controller = this;
                if (this.CardSettings && this.CardSettings.Load) {
                    this.CardSettings.Load(function (responseData) {
                        controller.Model.set("cardModel", responseData.Data);
                        controller.afterLoad();
                    });
                    return false;
                }
                controller.afterLoad();
                return true;
            };
            BaseCard.prototype.afterLoad = function () {
                this.setupTable();
                vars._app.HideLoading();
            };
            BaseCard.prototype.Add = function () {
                vars._editorData[this.CardSettings.EditIdName] = this.CardSettings.ValueIdNew;
                vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
            };
            BaseCard.prototype.afterAdd = function () {
            };
            BaseCard.prototype.addCopy = function () {
                var id = this.getSelectedRowId();
                if (id) {
                    var _id = +id;
                    if (_id > 0) {
                        vars._editorData[this.CardSettings.EditIdName] = _id;
                        vars._editorData["isCopy"] = true;
                        vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
                    }
                }
            };
            BaseCard.prototype.Edit = function () {
                var id = this.getSelectedRowId();
                if (id) {
                    var _id = +id;
                    if (_id > 0) {
                        vars._editorData[this.CardSettings.EditIdName] = _id;
                        vars._editorData["isCopy"] = false;
                        vars._app.OpenController({ urlController: this.CardSettings.EditController, backController: this });
                    }
                }
            };
            BaseCard.prototype.Delete = function () {
                var id = this.getSelectedRowId();
                if (id) {
                    var _id = +id;
                    var controller_1 = this;
                    if (this.CardSettings && this.CardSettings.Delete) {
                        this.CardSettings.Delete(_id, function (responseData) {
                            controller_1.afterDelete();
                        });
                    }
                }
            };
            BaseCard.prototype.afterDelete = function () {
                var id = this.getSelectedRowId();
                if (id) {
                    var _id = +id;
                    var model = this.Model.get("cardModel");
                    for (var i = model.length - 1; i >= 0; i--) {
                        if (model[i].id === _id) {
                            model.splice(i, 1);
                        }
                    }
                    this.setupRows();
                }
            };
            BaseCard.prototype.Close = function () {
            };
            return BaseCard;
        }(Base));
        Controller.BaseCard = BaseCard;
        var BaseReportWithFilter = (function (_super) {
            __extends(BaseReportWithFilter, _super);
            function BaseReportWithFilter() {
                var _this = _super.call(this) || this;
                if (_this.EditorSettings && _this.EditorSettings.ButtonSetings)
                    _this.EditorSettings.ButtonSetings.IsSave = false;
                _this.RestoreFilter();
                return _this;
            }
            BaseReportWithFilter.prototype.createModel = function () {
                return new kendo.data.ObservableObject({
                    "Header": "",
                    "filterModel": {},
                });
            };
            Object.defineProperty(BaseReportWithFilter.prototype, "FilterName", {
                get: function () {
                    return "reportFilter";
                },
                enumerable: false,
                configurable: true
            });
            BaseReportWithFilter.prototype.SaveFilter = function () {
                window.localStorage.setItem(this.FilterName, this.getSaveFilter());
            };
            BaseReportWithFilter.prototype.getSaveFilter = function () {
                return JSON.stringify(this.Filter);
            };
            BaseReportWithFilter.prototype.RestoreFilter = function () {
                var filter;
                var saved = window.localStorage.getItem(this.FilterName);
                if (!saved || saved === "\"{}\"") {
                    filter = this.getDefaultFilter();
                }
                else
                    filter = JSON.parse(saved);
                this.Model.set("filterModel", filter);
            };
            BaseReportWithFilter.prototype.getDefaultFilter = function () {
                return { datefrom: utils.date_ddmmyyyy(utils.dateToday()), dateto: utils.date_ddmmyyyy(utils.dateToday()) };
            };
            Object.defineProperty(BaseReportWithFilter.prototype, "Filter", {
                get: function () {
                    return this.Model.get("filterModel").toJSON();
                },
                set: function (filter) {
                    this.Model.set("filterModel", filter);
                },
                enumerable: false,
                configurable: true
            });
            BaseReportWithFilter.prototype.ViewHide = function (e) {
                this.SaveFilter();
                _super.prototype.ViewHide.call(this, e);
            };
            return BaseReportWithFilter;
        }(BaseEditor));
        Controller.BaseReportWithFilter = BaseReportWithFilter;
        var BaseReportTable = (function (_super) {
            __extends(BaseReportTable, _super);
            function BaseReportTable() {
                return _super.call(this) || this;
            }
            Object.defineProperty(BaseReportTable.prototype, "Columns", {
                get: function () {
                    var columns = [];
                    return columns;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseReportTable.prototype, "Table", {
                get: function () {
                    return this.tableControl;
                },
                set: function (table) {
                    this.tableControl = table;
                },
                enumerable: false,
                configurable: true
            });
            BaseReportTable.prototype.ViewInit = function (view) {
                var result = _super.prototype.ViewInit.call(this, view);
                var controls = [];
                controls.push(this.initializeTableRow());
                view.append(controls);
                this.SetupTable();
                return result;
            };
            BaseReportTable.prototype.SetupTable = function (rows) {
                this.tableControl.Rows = rows;
                this.tableControl.Columns = this.Columns;
                this.tableControl.Setup();
            };
            BaseReportTable.prototype.OnDetalize = function (row) {
            };
            BaseReportTable.prototype.initializeTableRow = function () {
                if (!this.tableControl)
                    this.tableControl = new ctrl.Control.BaseTable();
                this.tableControl.OnDetalize = $.proxy(this.OnDetalize, this);
                var tableRow = $('<div class="row row-table-report"></div>');
                var tableCol = $('<div class="col s12 m12 l12 xl12 col-table"></div>');
                tableCol.append(this.tableControl.InitView());
                tableRow.append(tableCol);
                return tableRow;
            };
            BaseReportTable.prototype.ViewResize = function (e) {
                _super.prototype.ViewResize.call(this, e);
                var tbody = (this.tableControl ? this.tableControl.TableBody : undefined);
                if (tbody && tbody.length > 0) {
                    tbody.height($(window).height() - tbody.offset().top - (0.2 * parseFloat(getComputedStyle(tbody[0]).fontSize)) - 1);
                }
            };
            BaseReportTable.prototype.ViewShow = function (e) {
                return _super.prototype.ViewShow.call(this, e);
            };
            BaseReportTable.prototype.ViewHide = function (e) {
                this.tableControl.DestroyView();
                _super.prototype.ViewHide.call(this, e);
            };
            BaseReportTable.prototype.destroyEvents = function () {
                _super.prototype.destroyEvents.call(this);
            };
            BaseReportTable.prototype.buildButtonClick = function (e) {
                this.SetupTable([]);
            };
            return BaseReportTable;
        }(BaseReportWithFilter));
        Controller.BaseReportTable = BaseReportTable;
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=basecontroller.js.map