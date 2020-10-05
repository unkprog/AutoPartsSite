define(["require", "exports", "app/core/variables", "app/core/basedialog"], function (require, exports, vars, bd) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Controller = void 0;
    var Controller;
    (function (Controller) {
        var Dialog;
        (function (Dialog) {
            class ModalDialog extends bd.Controller.Dialog.Base {
                constructor() {
                    super();
                    this.ViewInit(this.createView());
                }
                createModel() {
                    return new kendo.data.ObservableObject({
                        "Header": "",
                        "labelOk": vars._statres("button$label$ok"),
                    });
                }
                createView() {
                    let viewHtml;
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
                }
                createEvents() {
                    this.Close = this.createTouchClickEvent(this.dialogButtonOk, this.close);
                }
                destroyEvents() {
                    this.destroyTouchClickEvent(this.dialogButtonOk, this.Close);
                }
                Show(header, e) {
                    if (this.dialogContent)
                        this.dialogContent.html(e);
                    this.Model.set("Header", header);
                    $("body").append(this.View);
                    if (this.dialog)
                        this.dialog.modal("open");
                }
                close(e) {
                    if (this.dialog)
                        this.dialog.modal("close");
                    this.View.remove();
                    this.ViewHide(e);
                    this.dialog.modal("destroy");
                    if (this.OnClose)
                        this.OnClose();
                }
            }
            Dialog.ModalDialog = ModalDialog;
        })(Dialog = Controller.Dialog || (Controller.Dialog = {}));
    })(Controller = exports.Controller || (exports.Controller = {}));
});
//# sourceMappingURL=modaldialog.js.map