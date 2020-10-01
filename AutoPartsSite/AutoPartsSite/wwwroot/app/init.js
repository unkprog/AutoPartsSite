requirejs.config({
    baseUrl: "/Content",
    paths: {
        "jquery": "js/lib/jquery-3.3.1.min",
        "materialize": "js/lib/materialize/materialize",
        "materialize.pagination": "js/lib/materialize/materialize.pagination",
        "printThis": "js/lib/printthis/printThis",
        "jqueryprint": "js/lib/jquery.print.min",
        "chartjs": "js/lib/chartjs/Chart.min",
        "kendo.core": "js/lib/kendo/kendo.core.es5.min",
        "kendo.data": "js/lib/kendo/kendo.data.es5.min",
        "kendo.data.odata": "js/lib/kendo/kendo.data.odata.es5.min",
        "kendo.data.xml": "js/lib/kendo/kendo.data.xml.es5.min",
        "kendo.binder": "js/lib/kendo/kendo.binder.es5.min",
        "i18n": "js/lib/i18n.es5.min",
        "domReady": "js/lib/require/domReady.es5.min"
    },
    waitSeconds: 20
});

(function () {
    // override require call
    var requirejs_load = requirejs.load;
    var v = new Date().getTime().toString();
    requirejs.load = function (context, moduleId, url) {
        url += "?v=" + v;
        requirejs_load(context, moduleId, url);
    };
    // disable back button
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };
})();

require(["domReady", "jquery"], function (domReady, _jquery) {
    $("#progress-container").show();
    require(["materialize", "materialize.pagination", "kendo.binder", "chartjs", "printThis"], function (_materialize, _materializePager, _kendoBinder, _chartjs, _printThis) {
        domReady(function () {
            require(["app/application"], function (app) {
                var _app = new app.App.Application();
                $(window).on('resize', function (e) {
                    _app.Resize(e);
                });
                //window.onpopstate = function (e) {
                //    _app.ControllerBack(e);
                //};
                //disableBackButton();
            });
        });
    });
});

