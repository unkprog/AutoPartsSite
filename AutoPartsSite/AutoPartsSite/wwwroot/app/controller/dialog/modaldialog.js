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
define(["require", "exports", "app/core/variables", "app/core/basedialog"], function (require, exports, vars, bd) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Dialog;
        (function (Dialog) {
            var ModalDialog = /** @class */ (function (_super) {
                __extends(ModalDialog, _super);
                function ModalDialog() {
                    var _this = _super.call(this) || this;
                    _this.ViewInit(_this.createView());
                    return _this;
                }
                ModalDialog.prototype.createModel = function () {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "labelOk": vars._statres("button$label$ok"),
                    });
                };
                ModalDialog.prototype.createView = function () {
                    var viewHtml;
                    //<!-- Modal Structure -->
                    viewHtml = '<div class="error-dialog modal modal-fixed-footer">';
                    viewHtml += '    <div class="modal-content">';
                    viewHtml += '        <h4 class="error-dialog-header" data-bind="text:Header">Error</h4>';
                    viewHtml += '        <div class="error-dialog-content" class="row">';
                    viewHtml += '        </div>';
                    viewHtml += '    </div>';
                    viewHtml += '    <div class="modal-footer">';
                    viewHtml += '        <a class="error-dialog-ok btn width150px" data-bind="text:labelOk"></a>';
                    viewHtml += '    </div>';
                    viewHtml += '</div>';
                    this.dialog = $(viewHtml);
                    this.dialogContent = this.dialog.find(".error-dialog-content");
                    this.dialogButtonOk = this.dialog.find(".error-dialog-ok");
                    this.dialog.modal({ dismissible: false });
                    return this.dialog;
                };
                ModalDialog.prototype.createEvents = function () {
                    this.Close = this.createTouchClickEvent(this.dialogButtonOk, this.close);
                };
                ModalDialog.prototype.destroyEvents = function () {
                    this.destroyTouchClickEvent(this.dialogButtonOk, this.Close);
                };
                ModalDialog.prototype.Show = function (header, e) {
                    if (this.dialogContent)
                        this.dialogContent.html(e);
                    this.Model.set("Header", header);
                    $("body").append(this.View);
                    if (this.dialog)
                        this.dialog.modal("open");
                };
                ModalDialog.prototype.close = function (e) {
                    if (this.dialog)
                        this.dialog.modal("close");
                    this.View.remove();
                    this.ViewHide(e);
                    this.dialog.modal("destroy");
                    if (this.OnClose)
                        this.OnClose();
                };
                return ModalDialog;
            }(bd.Controller.Dialog.Base));
            Dialog.ModalDialog = ModalDialog;
        })(Dialog = Controller.Dialog || (Controller.Dialog = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=modaldialog.js.map