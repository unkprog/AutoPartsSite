let updateLocalStorage = localStorage.getItem('ls-version');
if (!updateLocalStorage || updateLocalStorage == null || updateLocalStorage != 'v0') {
    localStorage.clear();
    localStorage.setItem('ls-version', 'v0');
}

var localeStorage = localStorage.getItem('locale');
var locale = 'en';
if (localeStorage && localeStorage != null && localeStorage != '') {
    try {
        var lang = JSON.parse(localeStorage);
        locale = lang.Code.toLowerCase();
    }
    catch {
        locale = 'en';
    }
}


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
        "summernote": "lib/summernote/summernote-lite.min",
        "i18n": "lib/i18n.es5.min",
        "domReady": "lib/require/domReady.es5.min",
    },
    waitSeconds: 20,
    config: {
        //Set the config for the i18n
        //module ID
        i18n: {
            locale: locale
        }
    }
});

var rloader = {
    "Setup": function (ver) {
        // override require call
        var requirejs_load = requirejs.load;
        //var v = new Date().getTime().toString();
        requirejs.load = function (context, moduleId, url) {
            url += "?v=" + ver;
            requirejs_load(context, moduleId, url);
        };
        // disable back button
        history.pushState(null, null, location.href);
        window.onpopstate = function () {
            history.go(1);
        };
    }
}

require(["domReady", "jquery"], function (_domReady, _jquery) {
    _domReady(function () {
        $("#progress-container").show();
        history.replaceState(null, "", "");

        $.ajax({
            url: '/api/account/ver',
            type: "get",
            dataType: "json",
            processData: true,
            success: function (responseData, textStatus, jqXHR) {
                if (responseData.error)
                    console.error(responseData.error);
                else {
                    rloader.Setup(responseData.Data.Version);

                    require(["materialize", "kendo.binder", "i18n", "app/core/utils", "app/core/variables"
                        , "app/core/baseservice", "app/services/accountservice", "app/services/searchservice", "app/services/basketservice"
                        , "app/core/basecontroller", "app/core/baseapplication", "app/app"]
                        , function (_materialize, _kendoBinder, _i18n, utils, vars
                            , basesvc, accsvc, srhsvc, bsksvc
                            , basectrl, baseapp, app) {

                            var _app = null;
                            window.onpopstate = function (event) {
                                if (_app && _app != null && event && event.state && event.state.Page) {
                                    var page = event.state.Page;
                                    if (page.indexOf('/') == 0)
                                        page = page.substring(1);

                                    if (page == '')
                                        page = 'search/index';
                                    //_app.OpenController({ urlController: page, isPopState: true });
                                    history.go(-1);
                                    _app.OpenController({ urlController: page });
                                }
                                //console.log('location: ${document.location}, state: ${JSON.stringify(event.state)}');
                            };

                            $(window).on('resize', function (e) {
                                if (_app && _app != null)
                                _app.Resize(e);
                            });

                            vars._appData.Version = responseData.Data.Version;
                            //require(["app/app"], function (app) {
                            _app = new app.App.Application();
                            
                            //window.onpopstate = function (e) {
                            //    _app.ControllerBack(e);
                            //};
                            //disableBackButton();
                            //});
                        });
                }
            },
            error: function (e, textStatus, errorThrown) {
                console.error('ERROR!!! - /api/account/ver');
            }
        });
    });
});

