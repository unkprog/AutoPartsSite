import bc = require('app/core/basecontroller');

export namespace Controller.Dialog {
    export class Base extends bc.Controller.Base implements Interfaces.IDialog {
        public Show(header: string, e: string): void {
        }

        public OnClose: () => void;
    }
}