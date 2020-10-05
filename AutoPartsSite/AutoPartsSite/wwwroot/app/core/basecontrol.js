define(["require", "exports", "app/core/utils", "app/core/variables"], function (require, exports, utils, vars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Control = void 0;
    var Control;
    (function (Control) {
        class ReferenceFieldControl {
            constructor() {
            }
            InitControl(view, name, field, fieldout, header, cardcontroller, model) {
                let controlHtml = '<input id="' + name + '" type="text" disabled class="truncate black-text" data-bind="value: ' + fieldout + '" style="cursor:pointer;font-weight:bold;">';
                controlHtml += '<label for="' + name + '">' + header + '</label>';
                controlHtml += '<i id="' + name + '-clear" class="material-icons editor-header right doc-edit-ref-del">close</i>';
                let result = $(controlHtml);
                this.cardController = cardcontroller;
                this.field = field;
                this.model = model;
                this.fieldControl = view;
                this.fieldClearControl = result.find("#" + name + "-clear");
                view.append(result);
                return result;
            }
            createEvents() {
                if (this.fieldControl)
                    this.FieldButtonClick = utils.createTouchClickEvent(this.fieldControl, this.fieldButtonClick, this, this.fieldControl);
                if (this.fieldClearControl)
                    this.FieldClearButtonClick = utils.createTouchClickEvent(this.fieldClearControl, this.fieldClearButtonClick, this, this.fieldControl);
            }
            destroyEvents() {
                if (this.fieldClearControl)
                    utils.destroyTouchClickEvent(this.fieldClearControl, this.FieldClearButtonClick, this.fieldControl);
                if (this.fieldControl)
                    utils.destroyTouchClickEvent(this.fieldControl, this.FieldButtonClick, this.fieldControl);
            }
            fieldButtonClick(e) {
                let self = this;
                vars._app.OpenController({
                    urlController: self.cardController, isModal: true,
                    onLoadController: (controller) => {
                        let ctrlUnit = controller;
                        ctrlUnit.CardSettings.IsAdd = false;
                        ctrlUnit.CardSettings.IsAddCopy = false;
                        ctrlUnit.CardSettings.IsDelete = false;
                        ctrlUnit.CardSettings.IsEdit = false;
                        ctrlUnit.CardSettings.IsSelect = true;
                        ctrlUnit.OnSelect = $.proxy(self.selectValue, self);
                    }
                });
            }
            selectValue(controller) {
                let value = controller.getSelectedRecord();
                if (value) {
                    if (this.SelectValue)
                        this.SelectValue(value);
                    else
                        this.model.set(this.field, value);
                }
                M.updateTextFields();
            }
            fieldClearButtonClick(e) {
                e.preventDefault();
                e.stopPropagation();
                this.model.set(this.field, {});
                M.updateTextFields();
                return false;
            }
        }
        Control.ReferenceFieldControl = ReferenceFieldControl;
        class BaseCardFilterSettings {
            constructor(setupRows) {
                this.fieldSearch = "name";
                this.setupRows = setupRows;
            }
            saveFilter() {
                throw new Error("Method not implemented.");
            }
            restoreFilter() {
                throw new Error("Method not implemented.");
            }
            get FieldSearch() {
                return this.fieldSearch;
            }
            set FieldSearch(val) {
                this.fieldSearch = val;
            }
            InitControls() {
                let navbarHeader = '<nav class="card-search-nav editor-header z-depth-1">';
                navbarHeader += '   <div class="nav-wrapper">';
                navbarHeader += '       <form>';
                navbarHeader += '           <div class="input-field">';
                navbarHeader += '               <input id="card-view-search" type="search" required value="">';
                navbarHeader += '               <label class="label-icon" for="search"><i class="material-icons editor-header">search</i></label>';
                navbarHeader += '               <i id="card-view-search-clear" class="material-icons editor-header">close</i>';
                navbarHeader += '           </div>';
                navbarHeader += '       </form>';
                navbarHeader += '   </div>';
                navbarHeader += '</nav>';
                this.navSearch = $(navbarHeader);
                this.formSearch = this.navSearch.find('form');
                this.inputSearch = this.formSearch.find('#card-view-search');
                this.clearSearch = this.formSearch.find('#card-view-search-clear');
                return this.navSearch;
            }
            ViewControls() {
            }
            ResizeControls() {
            }
            createEvents() {
                if (this.clearSearch)
                    this.ClearButtonClick = utils.createTouchClickEvent(this.clearSearch, this.clearButtonClick, this);
                if (this.formSearch) {
                    this.proxySearch = $.proxy(this.search, this);
                    this.formSearch.on('submit', this.proxySearch);
                }
            }
            search(e) {
                e.preventDefault();
                if (this.setupRows)
                    this.setupRows();
                return false;
            }
            destroyEvents() {
                if (this.formSearch)
                    this.formSearch.off('submit', this.proxySearch);
                if (this.clearSearch)
                    utils.destroyTouchClickEvent(this.clearSearch, this.ClearButtonClick);
            }
            clearButtonClick(e) {
                if (this.inputSearch)
                    this.inputSearch.val("");
                if (this.setupRows)
                    this.setupRows();
            }
            GetItemsForView(data) {
                let result = [];
                let strSearch = (this.inputSearch ? this.inputSearch.val() : ""); // ($("#card-view-search").val() as string);
                let fieldSearch = this.FieldSearch;
                let isNotSearch = (utils.isNullOrEmpty(fieldSearch) || utils.isNullOrEmpty(strSearch));
                if (!isNotSearch)
                    strSearch = strSearch.toLowerCase();
                for (let i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                    if (isNotSearch) {
                        result.push(data[i]);
                    }
                    else if (data[i][fieldSearch].toLowerCase().indexOf(strSearch) > -1) {
                        result.push(data[i]);
                    }
                }
                return result;
            }
        }
        Control.BaseCardFilterSettings = BaseCardFilterSettings;
        class BaseTable {
            constructor() {
                this.columns = [];
                this.isScroll = true;
            }
            get Columns() {
                return this.columns;
            }
            set Columns(columns) {
                this.columns = columns;
            }
            get Rows() {
                return this.rows;
            }
            set Rows(rows) {
                this.rows = rows;
            }
            get IsScroll() {
                return this.isScroll;
            }
            set IsScroll(isScroll) {
                this.isScroll = isScroll;
            }
            get TableBody() {
                return this.tableBody;
            }
            InitView() {
                this.SortButtonClick = $.proxy(this.sortButtonClick, this);
                this.RowClick = $.proxy(this.rowClick, this);
                this.RowDoubleClick = $.proxy(this.rowDoubleClick, this);
                let htmlTable = '<table class="highlight">';
                htmlTable += '   <thead></thead>';
                htmlTable += '   <tbody></tbody>';
                htmlTable += '</table>';
                this.tableControl = $(htmlTable);
                this.tableHead = this.tableControl.find('thead');
                this.tableBody = this.tableControl.find('tbody');
                return this.tableControl;
            }
            get View() {
                return this.tableControl;
            }
            DestroyView() {
                this.detachSortEvents();
                this.destroyRowsEvents();
            }
            Setup(onlyRows = false) {
                if (onlyRows == false) {
                    this.detachSortEvents();
                    let headerHtml = this.getTableHeaderHtml();
                    this.tableHead.html(headerHtml);
                    if (this.tableBody) {
                        if (this.IsScroll === true) {
                            if (this.tableBody.hasClass("scroll-y") === false)
                                this.tableBody.addClass("scroll-y");
                        }
                        else
                            this.tableBody.removeClass("scroll-y");
                    }
                    this.attachSortEvents();
                }
                this.setupRows();
            }
            createRowsEvents() {
                if (this.tableRows) {
                    utils.createClickEvent(this.tableRows, this.RowClick, this, this.tableBody);
                    utils.createDblTouchClickEvent(this.tableRows, this.RowDoubleClick, this, this.tableBody);
                }
            }
            destroyRowsEvents() {
                if (this.tableRows) {
                    utils.destroyDblTouchClickEvent(this.tableRows, this.RowDoubleClick, this.tableBody);
                    utils.destroyClickEvent(this.tableRows, this.RowClick, this.tableBody);
                }
            }
            setupRows() {
                this.destroyRowsEvents();
                this.selectedRow = undefined;
                this.selectedDataRow = undefined;
                this.tableBody.html(this.getTableBodyHtml());
                let valueSum;
                for (let j = 0, jcount = (this.sumFieldsInfo.fields && this.sumFieldsInfo.fields.length ? this.sumFieldsInfo.fields.length : 0); j < jcount; j++) {
                    valueSum = this.sumFieldsInfo.sumFied[this.sumFieldsInfo.fields[j]];
                    this.tableHead.find('#' + this.sumFieldsInfo.fields[j] + '_sum').html(utils.numberToString(valueSum ? valueSum : 0, 2));
                }
                this.tableRows = this.tableBody.find('tr');
                this.createRowsEvents();
            }
            getTableHeaderHtml() {
                let columns = this.Columns;
                let html = '';
                this.sumFieldsInfo = { fields: [], sumFied: {}, orderfields: [] };
                let knSupport = kendo;
                html += '<tr>';
                for (let i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
                    html += '   <th';
                    if (columns[i].HeaderStyle || columns[i].IsOrder === true) {
                        if (columns[i].IsOrder === true) {
                            html += ' id="sort_' + i + '"';
                        }
                        html += ' class="';
                        if (columns[i].HeaderStyle)
                            html += columns[i].HeaderStyle;
                        if (columns[i].IsOrder === true) {
                            this.sumFieldsInfo.orderfields.push({ field: columns[i].Field, typeSort: 0, index: i });
                            html += (columns[i].HeaderStyle ? ' ' : '') + 'ccursor';
                        }
                        html += '"';
                    }
                    if (columns[i].HeaderColSpan) {
                        html += ' colspan="' + columns[i].HeaderColSpan + '"';
                    }
                    html += '>';
                    html += (columns[i].HeaderTemplate ? columns[i].HeaderTemplate : columns[i].Header);
                    if (columns[i].IsSum && columns[i].IsSum === true) {
                        html += ('<br/><span id="' + columns[i].Field + '_sum">0.00</span>');
                        this.sumFieldsInfo.fields.push(columns[i].Field);
                        this.sumFieldsInfo.sumFied[columns[i].Field] = 0;
                    }
                    html += '</th>';
                    //if (columns[i].HeaderColSpan) {
                    //    i = i + (columns[i].HeaderColSpan - 1);
                    //}
                }
                if (this.IsScroll === true)
                    html += '<th style="width:' + (knSupport.support.browser.chrome === true ? "17" : "17") + 'px;"></th>';
                html += '</tr>';
                return html;
            }
            attachSortEvents() {
                let columns = this.Columns;
                for (let i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
                    if (columns[i].IsOrder === true) {
                        let strId = 'sort_' + i;
                        utils.createTouchClickEvent(strId, this.SortButtonClick, this, this.tableHead);
                    }
                }
            }
            detachSortEvents() {
                let columns = this.Columns;
                for (let i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
                    if (columns[i].IsOrder === true) {
                        let strId = 'sort_' + i;
                        utils.destroyTouchClickEvent(strId, this.SortButtonClick, this.tableHead);
                    }
                }
            }
            getTableRowTemplate() {
                let columns = this.Columns;
                let html = '';
                html += '<tr id="table-row-#=rowtmpitem#">';
                for (let i = 0, icount = (columns && columns.length ? columns.length : 0); i < icount; i++) {
                    html += '   <td data-field="' + columns[i].Field + '"';
                    if (columns[i].FieldStyle || this.OnDetalize) {
                        html += ' class="';
                        if (columns[i].FieldStyle) {
                            html += columns[i].FieldStyle;
                        }
                        if (this.OnDetalize) {
                            html += ' ccursor';
                        }
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
                let data = this.Rows;
                if (data && data.length > 0) {
                    let templateRow = vars.getTemplate(this.getTableRowTemplate());
                    if (templateRow) {
                        for (let i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                            data[i]["rowtmpitem"] = i;
                            html += templateRow(data[i]);
                            for (let j = 0, jcount = (this.sumFieldsInfo.fields && this.sumFieldsInfo.fields.length ? this.sumFieldsInfo.fields.length : 0); j < jcount; j++) {
                                if (i === 0)
                                    this.sumFieldsInfo.sumFied[this.sumFieldsInfo.fields[j]] = data[i][this.sumFieldsInfo.fields[j]];
                                else
                                    this.sumFieldsInfo.sumFied[this.sumFieldsInfo.fields[j]] += data[i][this.sumFieldsInfo.fields[j]];
                            }
                        }
                    }
                }
                return html;
            }
            get SelectedDataRow() {
                return this.selectedDataRow;
            }
            UpdateRow() {
                if (this.selectedRow && this.selectedDataRow) {
                    let templateRow = vars.getTemplate(this.getTableRowTemplate());
                    let html = templateRow(this.selectedDataRow);
                    this.selectedRow.html($(html).html());
                }
            }
            SetSelectedDataRow(e) {
                let result = -1;
                if (this.selectedRow) {
                    this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
                }
                let currentTarget = e;
                while (currentTarget && currentTarget.nodeName != "TR") {
                    currentTarget = currentTarget.parentElement;
                }
                if (currentTarget) {
                    this.selectedRow = $(currentTarget);
                    if (this.selectedRow)
                        this.selectedRow.addClass("row-active z-depth-1 brown lighten-5");
                    result = +currentTarget.id.replace('table-row-', '');
                    this.selectedDataRow = this.Rows[result];
                }
                return result;
            }
            rowClick(e) {
                this.SetSelectedDataRow(e.currentTarget);
                if (this.OnSelect) {
                    this.OnSelect(this.selectedDataRow);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            rowDoubleClick(e) {
                if (this.OnDetalize) {
                    let index = +e.currentTarget.id.replace('table-row-', '');
                    let row = this.Rows[index];
                    this.OnDetalize(row);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            sortButtonClick(e) {
                let self = this;
                let strId = e.currentTarget.id;
                strId = strId.replace('sort_', '');
                let i = +strId;
                let columns = this.Columns;
                let orderfields = [];
                let colName = columns[i].Field;
                let isSum = columns[i].IsSum;
                let isNum = columns[i].IsNumber;
                orderfields = self.sumFieldsInfo.orderfields;
                orderfields.filter(x => x.field == colName);
                var findResult = $.grep(orderfields, function (x) { return x.field == colName; });
                let typeSort = 0;
                if (findResult && findResult.length > 0) {
                    typeSort = findResult[0].typeSort;
                }
                let colNameSplit = colName.split('.');
                let data = this.Rows;
                if (isNum == true || isSum === true) {
                    data.sort(function (a, b) {
                        let aval = a[colNameSplit[0]];
                        for (let i = 1, icount = colNameSplit.length; i < icount; i++)
                            aval = aval[colNameSplit[i]];
                        let bval = b[colNameSplit[0]];
                        for (let i = 1, icount = colNameSplit.length; i < icount; i++)
                            bval = bval[colNameSplit[i]];
                        return (typeSort === 0 || typeSort === 2 ? aval - bval : bval - aval);
                    });
                }
                else {
                    data.sort(function (a, b) {
                        let aval = a[colNameSplit[0]];
                        for (let i = 1, icount = colNameSplit.length; i < icount; i++)
                            aval = aval[colNameSplit[i]];
                        let bval = b[colNameSplit[0]];
                        for (let i = 1, icount = colNameSplit.length; i < icount; i++)
                            bval = bval[colNameSplit[i]];
                        return (typeSort === 0 || typeSort === 2 ? aval.localeCompare(bval) : bval.localeCompare(aval));
                    });
                }
                if (findResult && findResult.length > 0) {
                    findResult[0].typeSort = (typeSort === 0 || typeSort === 2 ? 1 : 2);
                }
                self.Rows = data;
                self.setupRows();
            }
        }
        Control.BaseTable = BaseTable;
        class BaseEditTable extends BaseTable {
            constructor() {
                super(...arguments);
                this.editData = { currentInputControl: undefined, currentCell: undefined, oldValue: undefined, field: "", index: -1 };
            }
            InitView() {
                let result = super.InitView();
                this.RowHeaderContextClick = $.proxy(this.rowHeaderContextClick, this);
                this.RowContextClick = $.proxy(this.rowContextClick, this);
                if (this.tableHead) {
                    this.tableHead.addClass("ccursor");
                    utils.createContextMenuEvent(this.tableHead, this.RowHeaderContextClick, this, result);
                }
                return result;
            }
            DestroyView() {
                this.destroyCurrentInputControl();
                if (this.tableHead)
                    utils.destroyContextMenuEvent(this.tableHead, this.RowHeaderContextClick, this.tableControl);
                super.DestroyView();
            }
            createRowsEvents() {
                super.createRowsEvents();
                if (this.tableRows)
                    utils.createContextMenuEvent(this.tableRows, this.RowContextClick, this, this.tableBody);
            }
            destroyRowsEvents() {
                if (this.tableRows)
                    utils.destroyContextMenuEvent(this.tableRows, this.RowContextClick, this.tableBody);
                super.destroyRowsEvents();
            }
            rowHeaderContextClick(e) {
                if (this.OnHeaderContextMenu) {
                    this.OnHeaderContextMenu(e);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            rowContextClick(e) {
                if (this.OnContextMenu) {
                    let index = +e.currentTarget.id.replace('table-row-', '');
                    let row = this.Rows[index];
                    this.OnContextMenu(e, row);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            attachEditEvents() {
                this.EditCellClick = utils.createTouchClickEvent(this.View.find('td'), this.editCellClick, this);
            }
            destroyEditEvents() {
                utils.destroyTouchClickEvent(this.View.find('td'), this.EditCellClick, this.View);
            }
            setupRows() {
                this.destroyEditEvents();
                super.setupRows();
                this.attachEditEvents();
            }
            editCellClick(e) {
                this.destroyCurrentInputControl();
                this.editData.currentCell = $(e.currentTarget);
                this.editData.field = this.editData.currentCell.data("field");
                if (this.editData.field) {
                    if (this.GetEditControl)
                        this.editData.currentInputControl = this.GetEditControl(this.editData.field);
                    if (this.editData.currentInputControl) {
                        this.EditCellBlur = utils.createBlurEvent(this.editData.currentInputControl, this.editCellBlur, this);
                        this.EditKeyEvent = utils.createEventListener(this.editData.currentInputControl, "keyup", this.editKeyEvent, this);
                        this.editData.currentCell.empty().addClass('td-edit-cell').append(this.editData.currentInputControl);
                        this.editData.currentInputControl.focus();
                    }
                    this.editData.index = this.SetSelectedDataRow(e.currentTarget);
                    if (this.SelectedDataRow) {
                        this.editData.oldValue = this.SelectedDataRow[this.editData.field];
                        if (this.editData.currentInputControl)
                            this.editData.currentInputControl.val(this.editData.oldValue ? this.editData.oldValue : "");
                    }
                }
            }
            UpdateRow() {
                this.destroyEditEvents();
                super.UpdateRow();
                this.attachEditEvents();
            }
            editCellBlur(e) {
                let checkResult = false;
                if (this.CheckValueEditControl && this.editData.currentInputControl && this.SelectedDataRow) {
                    checkResult = this.CheckValueEditControl(this.editData.field, this.editData.currentInputControl.val(), this.SelectedDataRow);
                    this.Rows[this.editData.index] = this.SelectedDataRow;
                }
                else
                    checkResult = true;
                if (checkResult == true) {
                    this.destroyCurrentInputControl();
                    this.UpdateRow();
                }
                else {
                    if (this.editData.currentInputControl)
                        this.editData.currentInputControl.focus();
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            editKeyEvent(e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    this.editCellBlur(e);
                }
            }
            destroyCurrentInputControl() {
                if (this.editData.currentInputControl) {
                    let parent = this.editData.currentInputControl.parent();
                    if (parent && parent.length > 0)
                        this.editData.currentInputControl.remove();
                    utils.destroyBlurEvent(this.editData.currentInputControl, this.EditCellBlur);
                    utils.destroyEventListener(this.editData.currentInputControl, "keyup", this.EditCellBlur);
                    this.editData.currentInputControl = undefined;
                }
                if (this.editData.currentCell)
                    this.editData.currentCell.removeClass('td-edit-cell');
            }
        }
        Control.BaseEditTable = BaseEditTable;
    })(Control = exports.Control || (exports.Control = {}));
});
//# sourceMappingURL=basecontrol.js.map