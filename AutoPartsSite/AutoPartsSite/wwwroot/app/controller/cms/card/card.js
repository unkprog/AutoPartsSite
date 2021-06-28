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
define(["require", "exports", "app/core/variables", "app/core/utils", "app/core/basecontroller", "app/services/cmsservice"], function (require, exports, vars, utils, base, cmss) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Cms;
        (function (Cms) {
            var Card;
            (function (Card_1) {
                var CardFilterSettings = (function () {
                    function CardFilterSettings(setupRows, fieldSearch) {
                        this.fieldSearch = fieldSearch;
                        this.setupRows = setupRows;
                        this._model = this.createModel();
                    }
                    Object.defineProperty(CardFilterSettings.prototype, "FieldSearch", {
                        get: function () {
                            return this.fieldSearch;
                        },
                        set: function (val) {
                            this.fieldSearch = val;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(CardFilterSettings.prototype, "Model", {
                        get: function () {
                            return this._model;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    CardFilterSettings.prototype.getDefDate = function () {
                        var dateTime = new Date();
                        dateTime.setHours(0, 0, 0, 0);
                        return dateTime;
                    };
                    CardFilterSettings.prototype.createModel = function () {
                        var data = this.restoreFilter();
                        var result = new kendo.data.ObservableObject({
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
                    };
                    CardFilterSettings.prototype.restoreFilter = function () {
                        var result;
                        var saved = window.localStorage.getItem(this.fieldSearch);
                        if (!saved || saved === "\"{}\"") {
                            var dateTime = utils.date_ddmmyyyy(this.getDefDate());
                            result = { datefrom: dateTime, dateto: dateTime };
                        }
                        else
                            result = JSON.parse(saved);
                        return result;
                    };
                    CardFilterSettings.prototype.saveFilter = function () {
                        var dataToSave = { datefrom: this._model.get("datefrom"), dateto: this._model.get("dateto") };
                        var toSave = JSON.stringify(dataToSave);
                        window.localStorage.setItem(this.fieldSearch, toSave);
                    };
                    CardFilterSettings.prototype.InitControls = function () {
                        var controller = this;
                        var filterHtml = '';
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
                        filterHtml += '        <a id="card-filter-view-btn-find" class="btn btncol"  data-bind="text:labelFind"></a>';
                        filterHtml += '    </div>';
                        filterHtml += '</div>';
                        filterHtml += '';
                        controller.filterControl = $(filterHtml);
                        controller.dateFromControl = controller.filterControl.find("#card-filter-view-date-start");
                        controller.dateFromControl.datepicker({
                            format: "dd.mm.yyyy",
                            onSelect: function (newDate) {
                                controller._model.set("datefrom", utils.date_ddmmyyyy(newDate));
                            }
                        });
                        controller.dateToControl = controller.filterControl.find("#card-filter-view-date-end");
                        controller.dateToControl.datepicker({
                            format: "dd.mm.yyyy",
                            onSelect: function (newDate) {
                                controller._model.set("dateto", utils.date_ddmmyyyy(newDate));
                            }
                        });
                        controller.dateFromControl.val(utils.date_ddmmyyyy(controller._model.get("datefrom")));
                        controller.dateToControl.val(utils.date_ddmmyyyy(controller._model.get("dateto")));
                        controller.searchButton = controller.filterControl.find("#card-filter-view-btn-find");
                        return controller.filterControl;
                    };
                    CardFilterSettings.prototype.ViewControls = function () {
                    };
                    CardFilterSettings.prototype.ResizeControls = function () {
                    };
                    CardFilterSettings.prototype.createEvents = function () {
                        kendo.bind(this.filterControl, this._model);
                        if (this.searchButton)
                            this.SearchButtonClick = utils.createTouchClickEvent(this.searchButton, this.searchButtonClick, this);
                    };
                    CardFilterSettings.prototype.destroyEvents = function () {
                        this.saveFilter();
                        this.filterControl.unbind();
                        if (this.searchButton)
                            utils.destroyTouchClickEvent(this.searchButton, this.SearchButtonClick);
                    };
                    CardFilterSettings.prototype.searchButtonClick = function (e) {
                        e.preventDefault();
                        if (this.setupRows)
                            this.setupRows();
                        return false;
                    };
                    CardFilterSettings.prototype.GetItemsForView = function (data) {
                        var result = data;
                        return result;
                    };
                    return CardFilterSettings;
                }());
                Card_1.CardFilterSettings = CardFilterSettings;
                var Card = (function (_super) {
                    __extends(Card, _super);
                    function Card() {
                        return _super.call(this) || this;
                    }
                    Object.defineProperty(Card.prototype, "CmsService", {
                        get: function () {
                            if (!this.cmsService)
                                this.cmsService = new cmss.Services.CmsService();
                            return this.cmsService;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Card.prototype.createOptions = function () {
                        return { Url: "/app/controller/cms/card/card.html", Id: "card-view" };
                    };
                    Card.prototype.createCardFilterSettings = function () {
                        return new CardFilterSettings($.proxy(this.loadData, this), this.FilterId);
                    };
                    Card.prototype.createCardSettings = function () {
                        return {
                            FieldId: this.FieldId, FilterSettings: this.CreateCardFilterSettings, ValueIdNew: -1, EditIdName: this.EditIdName, EditController: this.EditController,
                            IsAdd: this.IsAdd, IsAddCopy: this.IsAddCopy, IsEdit: this.IsEdit, IsDelete: this.IsDelete, IsSelect: this.IsSelect,
                            Load: this.LoadProxy, Delete: this.DeleteProxy,
                            Columns: this.Columns
                        };
                    };
                    Object.defineProperty(Card.prototype, "FieldId", {
                        get: function () {
                            return "Id";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "IsAdd", {
                        get: function () {
                            return true;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "IsAddCopy", {
                        get: function () {
                            return false;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "IsEdit", {
                        get: function () {
                            return true;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "IsDelete", {
                        get: function () {
                            return true;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "IsSelect", {
                        get: function () {
                            return false;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "CreateCardFilterSettings", {
                        get: function () {
                            return undefined;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "LoadProxy", {
                        get: function () {
                            return undefined;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "DeleteProxy", {
                        get: function () {
                            return undefined;
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "Columns", {
                        get: function () {
                            return this.columns();
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Card.prototype.columns = function () {
                        return [];
                    };
                    Object.defineProperty(Card.prototype, "EditIdName", {
                        get: function () {
                            return "";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "EditController", {
                        get: function () {
                            return "";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    Object.defineProperty(Card.prototype, "FilterId", {
                        get: function () {
                            return "CardFilterSettings";
                        },
                        enumerable: false,
                        configurable: true
                    });
                    return Card;
                }(base.Controller.BaseCard));
                Card_1.Card = Card;
            })(Card = Cms.Card || (Cms.Card = {}));
        })(Cms = Controller.Cms || (Controller.Cms = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=card.js.map