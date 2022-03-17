using System.IO;
using System.Threading.Tasks;
using AutoPartsSite.Core.Thread;
using AutoPartsSite.Core.Cef;

namespace AutoPartsSite.Managers
{
    public static class SsrManager
    {
        public static void SSR(string file, string fileSsr, string html)
        {
            //AsyncContext.Run(async delegate
            //{
            //    Cef.EnableWaitForBrowsersToClose();
            //    var settings = new CefSettings();
            //    settings.CachePath = Path.GetFullPath("cache");

            //    var success = await Cef.InitializeAsync(settings);

            //    if (!success)
            //    {
            //        return;
            //    }

            //    await MainAsync(html, "cache\\path1");


            //    Cef.WaitForBrowsersToClose();

            //    Cef.Shutdown();
            //});
        }

        //private static JsBridge bridge;

        //private static void InitBridge(ChromiumWebBrowser browser)
        //{
        //    //CefSharpSettings.LegacyJavascriptBindingEnabled = true;

        //    if (bridge == null)
        //    {
        //        bridge = new JsBridge();
        //        browser.JavascriptObjectRepository.Settings.LegacyBindingEnabled = true;
        //        browser.JavascriptObjectRepository.ResolveObject += (s, e) =>
        //        {
        //            if (e.ObjectName == CefSharp.Internals.JavascriptObjectRepository.LegacyObjects)
        //            {
        //                //ADD YOUR LEGACY
        //                e.ObjectRepository.Register("nativeBridge", bridge, options: BindingOptions.DefaultBinder);
        //            }
        //        };

        //        //browser.JavascriptObjectRepository.Register("nativeBridge", bridge, options: BindingOptions.DefaultBinder);

        //        bridge.AddCommand("ViewShow", ViewShow);
        //    }
        //}

        private static void ViewShow(string aParams)
        {
            
        }

        //private static async Task MainAsync(string html, string cachePath)
        //{
        //    var browserSettings = new BrowserSettings
        //    {
        //        //Reduce rendering speed to one frame per second so it's easier to take screen shots
        //        WindowlessFrameRate = 1,
                
        //    };

        //    var requestContextSettings = new RequestContextSettings
        //    {
        //        CachePath = Path.GetFullPath(cachePath)
        //    };

        //    // RequestContext can be shared between browser instances and allows for custom settings
        //    // e.g. CachePath
        //    using (var requestContext = new RequestContext(requestContextSettings))
        //    using (var browser = new ChromiumWebBrowser(new CefSharp.Web.HtmlString(html), browserSettings, requestContext))
        //    {
        //        InitBridge(browser);
        //        //Wait for the page to finish loading (all resources will have been loaded, rendering is likely still happening)
        //        browser.LoadingStateChanged += async (sender, args) =>
        //        {
        //            //Wait for the Page to finish loading
        //            if (args.IsLoading == false)
        //            {
        //                string source1 = await browser.GetBrowser().MainFrame.GetSourceAsync();
        //                //args.browser.ExecuteJavaScriptAsync("alert('All Resources Have Loaded');");
        //            }
        //        };

        //        //Wait for the MainFrame to finish loading
        //        browser.FrameLoadEnd += async (sender, args) =>
        //        {
        //            //Wait for the MainFrame to finish loading
        //            if (args.Frame.IsMain)
        //            {
        //                //args.Frame.ExecuteJavaScriptAsync("alert('MainFrame finished loading');");
        //                string source2 = await args.Frame.GetSourceAsync();
        //            }
        //        };

        //        await browser.WaitForInitialLoadAsync();

        //        //string source = await browser.GetBrowser().MainFrame.GetSourceAsync();
        //        //int i = 0;
        //        //i = i + 1;

        //    }
        //}

    }
}
