interface JQuery {
    sidenav(methodName?: any, paramName?: any): JQuery;
    tabs(methodName?: any, paramName?: any): JQuery;
    modal(methodName?: any, paramName?: any): JQuery;
    formSelect(methodName?: any, paramName?: any): JQuery;
    datepicker(methodName?: any, paramName?: any): JQuery;
    tablePagination(options: any): JQuery;
    characterCounter(): JQuery;
    dropdown(methodName?: any, paramName?: any): JQuery;
    recalculateDimensions(): JQuery;
    chips(methodName?: any, paramName?: any): JQuery;
    collapsible(methodName?: any, paramName?: any): JQuery;
    tooltip(methodName?: any, paramName?: any): JQuery;
}


declare namespace M {
    interface toastOptions
    {
        html?: string;
    }

    function updateTextFields(): JQuery;
    function textareaAutoResize(els?:any): JQuery;
    function toast(options :toastOptions): JQuery;
    export namespace Modal {
        function getInstance(elems: any, options?: any): JQuery;
    }
    export namespace Datepicker {
        function getInstance(elems: any, options?: any): any;
    }
    export namespace FormSelect {
        function init(elems: any, options?: any): JQuery;
    }

    export namespace Tabs {
        function getInstance(elems: any): any;
        function updateTabIndicator(): JQuery;
    }

    export namespace Dropdown {
        function getInstance(elems: any): any;
        function init(elems: any, options?: any): JQuery;
    }

    export namespace Tooltip {
        function init(elems: any, options?: any): JQuery;
    }
}

