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
define(["require", "exports", "app/core/utils", "app/core/variables"], function (require, exports, utils, vars) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Control = void 0;
    var Control;
    (function (Control) {
        var ReferenceFieldControl = (function () {
            function ReferenceFieldControl() {
            }
            ReferenceFieldControl.prototype.InitControl = function (view, name, field, fieldout, header, cardcontroller, model) {
                var controlHtml = '<input id="' + name + '" type="text" disabled class="truncate black-text" data-bind="value: ' + fieldout + '" style="cursor:pointer;font-weight:bold;">';
                controlHtml += '<label for="' + name + '">' + header + '</label>';
                controlHtml += '<i id="' + name + '-clear" class="material-icons editor-header right doc-edit-ref-del">close</i>';
                var result = $(controlHtml);
                this.cardController = cardcontroller;
                this.field = field;
                this.model = model;
                this.fieldControl = view;
                this.fieldClearControl = result.find("#" + name + "-clear");
                view.append(result);
                return result;
            };
            ReferenceFieldControl.prototype.createEvents = function () {
                if (this.fieldControl)
                    this.FieldButtonClick = utils.createTouchClickEvent(this.fieldControl, this.fieldButtonClick, this, this.fieldControl);
                if (this.fieldClearControl)
                    this.FieldClearButtonClick = utils.createTouchClickEvent(this.fieldClearControl, this.fieldClearButtonClick, this, this.fieldControl);
            };
            ReferenceFieldControl.prototype.destroyEvents = function () {
                if (this.fieldClearControl)
                    utils.destroyTouchClickEvent(this.fieldClearControl, this.FieldClearButtonClick, this.fieldControl);
                if (this.fieldControl)
                    utils.destroyTouchClickEvent(this.fieldControl, this.FieldButtonClick, this.fieldControl);
            };
            ReferenceFieldControl.prototype.fieldButtonClick = function (e) {
                var self = this;
                vars._app.OpenController({
                    urlController: self.cardController, isModal: true,
                    onLoadController: function (controller) {
                        var ctrlUnit = controller;
                        ctrlUnit.CardSettings.IsAdd = false;
                        ctrlUnit.CardSettings.IsAddCopy = false;
                        ctrlUnit.CardSettings.IsDelete = false;
                        ctrlUnit.CardSettings.IsEdit = false;
                        ctrlUnit.CardSettings.IsSelect = true;
                        ctrlUnit.OnSelect = $.proxy(self.selectValue, self);
                    }
                });
            };
            ReferenceFieldControl.prototype.selectValue = function (controller) {
                var value = controller.getSelectedRecord();
                if (value) {
                    if (this.SelectValue)
                        this.SelectValue(value);
                    else
                        this.model.set(this.field, value);
                }
                M.updateTextFields();
            };
            ReferenceFieldControl.prototype.fieldClearButtonClick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                this.model.set(this.field, {});
                M.updateTextFields();
                return false;
            };
            return ReferenceFieldControl;
        }());
        Control.ReferenceFieldControl = ReferenceFieldControl;
        var BaseCardFilterSettings = (function () {
            function BaseCardFilterSettings(setupRows) {
                this.fieldSearch = "name";
                this.setupRows = setupRows;
            }
            BaseCardFilterSettings.prototype.saveFilter = function () {
                throw new Error("Method not implemented.");
            };
            BaseCardFilterSettings.prototype.restoreFilter = function () {
                throw new Error("Method not implemented.");
            };
            Object.defineProperty(BaseCardFilterSettings.prototype, "FieldSearch", {
                get: function () {
                    return this.fieldSearch;
                },
                set: function (val) {
                    this.fieldSearch = val;
                },
                enumerable: false,
                configurable: true
            });
            BaseCardFilterSettings.prototype.InitControls = function () {
                var navbarHeader = '<nav class="card-search-nav editor-header z-depth-1">';
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
            };
            BaseCardFilterSettings.prototype.ViewControls = function () {
            };
            BaseCardFilterSettings.prototype.ResizeControls = function () {
            };
            BaseCardFilterSettings.prototype.createEvents = function () {
                if (this.clearSearch)
                    this.ClearButtonClick = utils.createTouchClickEvent(this.clearSearch, this.clearButtonClick, this);
                if (this.formSearch) {
                    this.proxySearch = $.proxy(this.search, this);
                    this.formSearch.on('submit', this.proxySearch);
                }
            };
            BaseCardFilterSettings.prototype.search = function (e) {
                e.preventDefault();
                if (this.setupRows)
                    this.setupRows();
                return false;
            };
            BaseCardFilterSettings.prototype.destroyEvents = function () {
                if (this.formSearch)
                    this.formSearch.off('submit', this.proxySearch);
                if (this.clearSearch)
                    utils.destroyTouchClickEvent(this.clearSearch, this.ClearButtonClick);
            };
            BaseCardFilterSettings.prototype.clearButtonClick = function (e) {
                if (this.inputSearch)
                    this.inputSearch.val("");
                if (this.setupRows)
                    this.setupRows();
            };
            BaseCardFilterSettings.prototype.GetItemsForView = function (data) {
                var result = [];
                var strSearch = (this.inputSearch ? this.inputSearch.val() : "");
                var fieldSearch = this.FieldSearch;
                var isNotSearch = (utils.isNullOrEmpty(fieldSearch) || utils.isNullOrEmpty(strSearch));
                if (!isNotSearch)
                    strSearch = strSearch.toLowerCase();
                for (var i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                    if (isNotSearch) {
                        result.push(data[i]);
                    }
                    else if (data[i][fieldSearch].toLowerCase().indexOf(strSearch) > -1) {
                        result.push(data[i]);
                    }
                }
                return result;
            };
            return BaseCardFilterSettings;
        }());
        Control.BaseCardFilterSettings = BaseCardFilterSettings;
        var BaseTable = (function () {
            function BaseTable() {
                this.columns = [];
                this.isScroll = true;
            }
            Object.defineProperty(BaseTable.prototype, "Columns", {
                get: function () {
                    return this.columns;
                },
                set: function (columns) {
                    this.columns = columns;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseTable.prototype, "Rows", {
                get: function () {
                    return this.rows;
                },
                set: function (rows) {
                    this.rows = rows;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseTable.prototype, "IsScroll", {
                get: function () {
                    return this.isScroll;
                },
                set: function (isScroll) {
                    this.isScroll = isScroll;
                },
                enumerable: false,
                configurable: true
            });
            Object.defineProperty(BaseTable.prototype, "TableBody", {
                get: function () {
                    return this.tableBody;
                },
                enumerable: false,
                configurable: true
            });
            BaseTable.prototype.InitView = function () {
                this.SortButtonClick = $.proxy(this.sortButtonClick, this);
                this.RowClick = $.proxy(this.rowClick, this);
                this.RowDoubleClick = $.proxy(this.rowDoubleClick, this);
                var htmlTable = '<table class="highlight">';
                htmlTable += '   <thead></thead>';
                htmlTable += '   <tbody></tbody>';
                htmlTable += '</table>';
                this.tableControl = $(htmlTable);
                this.tableHead = this.tableControl.find('thead');
                this.tableBody = this.tableControl.find('tbody');
                return this.tableControl;
            };
            Object.defineProperty(BaseTable.prototype, "View", {
                get: function () {
                    return this.tableControl;
                },
                enumerable: false,
                configurable: true
            });
            BaseTable.prototype.DestroyView = function () {
                this.detachSortEvents();
                this.destroyRowsEvents();
            };
            BaseTable.prototype.Setup = function (onlyRows) {
                if (onlyRows === void 0) { onlyRows = false; }
                if (onlyRows == false) {
                    this.detachSortEvents();
                    var headerHtml = this.getTableHeaderHtml();
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
            };
            BaseTable.prototype.createRowsEvents = function () {
                if (this.tableRows) {
                    utils.createClickEvent(this.tableRows, this.RowClick, this, this.tableBody);
                    utils.createDblTouchClickEvent(this.tableRows, this.RowDoubleClick, this, this.tableBody);
                }
            };
            BaseTable.prototype.destroyRowsEvents = function () {
                if (this.tableRows) {
                    utils.destroyDblTouchClickEvent(this.tableRows, this.RowDoubleClick, this.tableBody);
                    utils.destroyClickEvent(this.tableRows, this.RowClick, this.tableBody);
                }
            };
            BaseTable.prototype.setupRows = function () {
                this.destroyRowsEvents();
                this.selectedRow = undefined;
                this.selectedDataRow = undefined;
                this.tableBody.html(this.getTableBodyHtml());
                var valueSum;
                for (var j = 0, jcount = (this.sumFieldsInfo.fields && this.sumFieldsInfo.fields.length ? this.sumFieldsInfo.fields.length : 0); j < jcount; j++) {
                    valueSum = this.sumFieldsInfo.sumFied[this.sumFieldsInfo.fields[j]];
                    this.tableHead.find('#' + this.sumFieldsInfo.fields[j] + '_sum').html(utils.numberToString(valueSum ? valueSum : 0, 2));
                }
                this.tableRows = this.tableBody.find('tr');
                this.createRowsEvents();
            };
            BaseTable.prototype.getTableHeaderHtml = function () {
                var columns = this.Columns;
                var html = '';
                this.sumFieldsInfo = { fields: [], sumFied: {}, orderfields: [] };
                var knSupport = kendo;
                html += '<tr>';
                for (var i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
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
                }
                if (this.IsScroll === true)
                    html += '<th style="width:' + (knSupport.support.browser.chrome === true ? "17" : "17") + 'px;"></th>';
                html += '</tr>';
                return html;
            };
            BaseTable.prototype.attachSortEvents = function () {
                var columns = this.Columns;
                for (var i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
                    if (columns[i].IsOrder === true) {
                        var strId = 'sort_' + i;
                        utils.createTouchClickEvent(strId, this.SortButtonClick, this, this.tableHead);
                    }
                }
            };
            BaseTable.prototype.detachSortEvents = function () {
                var columns = this.Columns;
                for (var i = 0, icount = columns && columns.length ? columns.length : 0; i < icount; i++) {
                    if (columns[i].IsOrder === true) {
                        var strId = 'sort_' + i;
                        utils.destroyTouchClickEvent(strId, this.SortButtonClick, this.tableHead);
                    }
                }
            };
            BaseTable.prototype.getTableRowTemplate = function () {
                var columns = this.Columns;
                var html = '';
                html += '<tr id="table-row-#=rowtmpitem#">';
                for (var i = 0, icount = (columns && columns.length ? columns.length : 0); i < icount; i++) {
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
            };
            BaseTable.prototype.getTableBodyHtml = function () {
                var html = '';
                var data = this.Rows;
                if (data && data.length > 0) {
                    var templateRow = vars.getTemplate(this.getTableRowTemplate());
                    if (templateRow) {
                        for (var i = 0, icount = (data && data.length ? data.length : 0); i < icount; i++) {
                            data[i]["rowtmpitem"] = i;
                            html += templateRow(data[i]);
                            for (var j = 0, jcount = (this.sumFieldsInfo.fields && this.sumFieldsInfo.fields.length ? this.sumFieldsInfo.fields.length : 0); j < jcount; j++) {
                                if (i === 0)
                                    this.sumFieldsInfo.sumFied[this.sumFieldsInfo.fields[j]] = data[i][this.sumFieldsInfo.fields[j]];
                                else
                                    this.sumFieldsInfo.sumFied[this.sumFieldsInfo.fields[j]] += data[i][this.sumFieldsInfo.fields[j]];
                            }
                        }
                    }
                }
                return html;
            };
            Object.defineProperty(BaseTable.prototype, "SelectedDataRow", {
                get: function () {
                    return this.selectedDataRow;
                },
                enumerable: false,
                configurable: true
            });
            BaseTable.prototype.UpdateRow = function () {
                if (this.selectedRow && this.selectedDataRow) {
                    var templateRow = vars.getTemplate(this.getTableRowTemplate());
                    var html = templateRow(this.selectedDataRow);
                    this.selectedRow.html($(html).html());
                }
            };
            BaseTable.prototype.SetSelectedDataRow = function (e) {
                var result = -1;
                if (this.selectedRow) {
                    this.selectedRow.removeClass("row-active z-depth-1 brown lighten-5");
                }
                var currentTarget = e;
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
            };
            BaseTable.prototype.rowClick = function (e) {
                this.SetSelectedDataRow(e.currentTarget);
                if (this.OnSelect) {
                    this.OnSelect(this.selectedDataRow);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            BaseTable.prototype.rowDoubleClick = function (e) {
                if (this.OnDetalize) {
                    var index = +e.currentTarget.id.replace('table-row-', '');
                    var row = this.Rows[index];
                    this.OnDetalize(row);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            BaseTable.prototype.sortButtonClick = function (e) {
                var self = this;
                var strId = e.currentTarget.id;
                strId = strId.replace('sort_', '');
                var i = +strId;
                var columns = this.Columns;
                var orderfields = [];
                var colName = columns[i].Field;
                var isSum = columns[i].IsSum;
                var isNum = columns[i].IsNumber;
                orderfields = self.sumFieldsInfo.orderfields;
                orderfields.filter(function (x) { return x.field == colName; });
                var findResult = $.grep(orderfields, function (x) { return x.field == colName; });
                var typeSort = 0;
                if (findResult && findResult.length > 0) {
                    typeSort = findResult[0].typeSort;
                }
                var colNameSplit = colName.split('.');
                var data = this.Rows;
                if (isNum == true || isSum === true) {
                    data.sort(function (a, b) {
                        var aval = a[colNameSplit[0]];
                        for (var i_1 = 1, icount = colNameSplit.length; i_1 < icount; i_1++)
                            aval = aval[colNameSplit[i_1]];
                        var bval = b[colNameSplit[0]];
                        for (var i_2 = 1, icount = colNameSplit.length; i_2 < icount; i_2++)
                            bval = bval[colNameSplit[i_2]];
                        return (typeSort === 0 || typeSort === 2 ? aval - bval : bval - aval);
                    });
                }
                else {
                    data.sort(function (a, b) {
                        var aval = a[colNameSplit[0]];
                        for (var i_3 = 1, icount = colNameSplit.length; i_3 < icount; i_3++)
                            aval = aval[colNameSplit[i_3]];
                        var bval = b[colNameSplit[0]];
                        for (var i_4 = 1, icount = colNameSplit.length; i_4 < icount; i_4++)
                            bval = bval[colNameSplit[i_4]];
                        return (typeSort === 0 || typeSort === 2 ? aval.localeCompare(bval) : bval.localeCompare(aval));
                    });
                }
                if (findResult && findResult.length > 0) {
                    findResult[0].typeSort = (typeSort === 0 || typeSort === 2 ? 1 : 2);
                }
                self.Rows = data;
                self.setupRows();
            };
            return BaseTable;
        }());
        Control.BaseTable = BaseTable;
        var BaseEditTable = (function (_super) {
            __extends(BaseEditTable, _super);
            function BaseEditTable() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.editData = { currentInputControl: undefined, currentCell: undefined, oldValue: undefined, field: "", index: -1 };
                return _this;
            }
            BaseEditTable.prototype.InitView = function () {
                var result = _super.prototype.InitView.call(this);
                this.RowHeaderContextClick = $.proxy(this.rowHeaderContextClick, this);
                this.RowContextClick = $.proxy(this.rowContextClick, this);
                if (this.tableHead) {
                    this.tableHead.addClass("ccursor");
                    utils.createContextMenuEvent(this.tableHead, this.RowHeaderContextClick, this, result);
                }
                return result;
            };
            BaseEditTable.prototype.DestroyView = function () {
                this.destroyCurrentInputControl();
                if (this.tableHead)
                    utils.destroyContextMenuEvent(this.tableHead, this.RowHeaderContextClick, this.tableControl);
                _super.prototype.DestroyView.call(this);
            };
            BaseEditTable.prototype.createRowsEvents = function () {
                _super.prototype.createRowsEvents.call(this);
                if (this.tableRows)
                    utils.createContextMenuEvent(this.tableRows, this.RowContextClick, this, this.tableBody);
            };
            BaseEditTable.prototype.destroyRowsEvents = function () {
                if (this.tableRows)
                    utils.destroyContextMenuEvent(this.tableRows, this.RowContextClick, this.tableBody);
                _super.prototype.destroyRowsEvents.call(this);
            };
            BaseEditTable.prototype.rowHeaderContextClick = function (e) {
                if (this.OnHeaderContextMenu) {
                    this.OnHeaderContextMenu(e);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            BaseEditTable.prototype.rowContextClick = function (e) {
                if (this.OnContextMenu) {
                    var index = +e.currentTarget.id.replace('table-row-', '');
                    var row = this.Rows[index];
                    this.OnContextMenu(e, row);
                }
                e.preventDefault();
                e.stopPropagation();
                return false;
            };
            BaseEditTable.prototype.attachEditEvents = function () {
                this.EditCellClick = utils.createTouchClickEvent(this.View.find('td'), this.editCellClick, this);
            };
            BaseEditTable.prototype.destroyEditEvents = function () {
                utils.destroyTouchClickEvent(this.View.find('td'), this.EditCellClick, this.View);
            };
            BaseEditTable.prototype.setupRows = function () {
                this.destroyEditEvents();
                _super.prototype.setupRows.call(this);
                this.attachEditEvents();
            };
            BaseEditTable.prototype.editCellClick = function (e) {
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
            };
            BaseEditTable.prototype.UpdateRow = function () {
                this.destroyEditEvents();
                _super.prototype.UpdateRow.call(this);
                this.attachEditEvents();
            };
            BaseEditTable.prototype.editCellBlur = function (e) {
                var checkResult = false;
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
            };
            BaseEditTable.prototype.editKeyEvent = function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) {
                    this.editCellBlur(e);
                }
            };
            BaseEditTable.prototype.destroyCurrentInputControl = function () {
                if (this.editData.currentInputControl) {
                    var parent_1 = this.editData.currentInputControl.parent();
                    if (parent_1 && parent_1.length > 0)
                        this.editData.currentInputControl.remove();
                    utils.destroyBlurEvent(this.editData.currentInputControl, this.EditCellBlur);
                    utils.destroyEventListener(this.editData.currentInputControl, "keyup", this.EditCellBlur);
                    this.editData.currentInputControl = undefined;
                }
                if (this.editData.currentCell)
                    this.editData.currentCell.removeClass('td-edit-cell');
            };
            return BaseEditTable;
        }(BaseTable));
        Control.BaseEditTable = BaseEditTable;
    })(Control = exports.Control || (exports.Control = {}));
});
//# sourceMappingURL=basecontrol.js.map