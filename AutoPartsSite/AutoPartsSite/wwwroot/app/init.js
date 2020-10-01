requirejs.config({
    baseUrl: "/",
    paths: {
        "jquery": "lib/jquery/dist/jquery.min",
        "materialize": "lib/materialize/dist/js/materialize",
        "kendo.core": "lib/kendo/kendo.core.es5.min",
        "kendo.data": "lib/kendo/kendo.data.es5.min",
        "kendo.data.odata": "lib/kendo/kendo.data.odata.es5.min",
        "kendo.data.xml": "lib/kendo/kendo.data.xml.es5.min",
        "kendo.binder": "lib/kendo/kendo.binder.es5.min",
        "i18n": "lib/i18n.es5.min",
        "domReady": "lib/require/domReady.es5.min"
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
    require(["materialize", "kendo.binder", "i18n"], function (_materialize, _kendoBinder, i18n) {
        //i18n.locale = 'root';
        //i18n.translations = { root };
        domReady(function () {
            require(["app/app"], function (app) {
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

