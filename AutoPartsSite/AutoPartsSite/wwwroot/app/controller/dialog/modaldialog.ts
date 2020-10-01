import vars = require('app/core/variables');
import bd = require('app/core/basedialog');

export namespace Controller.Dialog {
    export class ModalDialog extends bd.Controller.Dialog.Base {

        constructor() {
            super();
            this.ViewInit(this.createView());
        }

        protected createModel(): kendo.data.ObservableObject {
            return new kendo.data.ObservableObject({
                "Header": "",
                "labelOk": vars._statres("button$label$ok"),
            });
        }

        private dialog: JQuery;
        private dialogContent: JQuery;
        private dialogButtonOk: JQuery;
        private createView(): JQuery {
            let viewHtml: string;

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

        protected createEvents(): void {
            this.Close = this.createTouchClickEvent(this.dialogButtonOk, this.close);
        }

        protected destroyEvents(): void {
            this.destroyTouchClickEvent(this.dialogButtonOk, this.Close);
        }

        public Show(header:string, e: string): void {
            if (this.dialogContent)
                this.dialogContent.html(e);
            this.Model.set("Header", header);
            $("body").append(this.View);
            if (this.dialog)
                this.dialog.modal("open");
           
        }

        public Close: { (e: any): void; };
        private close(e) {
            if (this.dialog)
                this.dialog.modal("close");
            this.View.remove();
            this.ViewHide(e);
            this.dialog.modal("destroy");

            if (this.OnClose)
                this.OnClose();
        }
    }
}