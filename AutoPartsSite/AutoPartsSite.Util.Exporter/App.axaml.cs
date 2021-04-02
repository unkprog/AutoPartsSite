using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using AutoPartsSite.Util.Exporter.Views;
using System.Collections.Generic;
using AutoPartsSite.Core.Extensions;
using Avalonia.Threading;
using System;

namespace AutoPartsSite.Util.Exporter
{
    public class App : Application
    {
        public override void Initialize()
        {
            AvaloniaXamlLoader.Load(this);
        }

        
        public override void OnFrameworkInitializationCompleted()
        {
            if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            {
                Dictionary<string, string>? args = getArgsParams(desktop);

                MainWindowViewModel dataContext = new MainWindowViewModel();
                MainWindow mainWindow = new MainWindow { DataContext = dataContext };
                desktop.MainWindow = mainWindow;
                if (args != null)
                    runWithArgs(desktop, dataContext, args);
            }

            base.OnFrameworkInitializationCompleted();
        }

        private void runWithArgs(IClassicDesktopStyleApplicationLifetime app, MainWindowViewModel dataContext, Dictionary<string, string>? args)
        {
            //server=.;sspi=true;user=sa;login=1;db=GlobalParts;company=12;agreement=7
            if (args == null) return;

            ConnectViewModel? cvm = dataContext.CurrentContent as ConnectViewModel;
            if (cvm == null) return;

            if (args.ContainsKey("server")) cvm.Connection.DataSource = args["server"];
            if (args.ContainsKey("sspi")) cvm.Connection.IsSSPI = args["sspi"] == "true";
            if (!cvm.Connection.IsSSPI)
            {
                if (args.ContainsKey("user")) cvm.Connection.UserID = args["user"];
                if (args.ContainsKey("login")) cvm.Connection.Password = args["login"];
            }
            if (args.ContainsKey("server")) cvm.Connection.InitialCatalog = args["db"];

            if (!dataContext.Next()) return;

            SelectAgreementsViewModel? savm = dataContext.CurrentContent as SelectAgreementsViewModel;
            if (savm == null) return;

            savm.SelectOneRecordAgreements(args.ContainsKey("company") ? args["company"].ToInt() : 0, args.ContainsKey("agreement") ? args["agreement"].ToInt() : 0);

            dataContext.onEndExport = () => Dispatcher.UIThread.InvokeAsync((Action)delegate ()
            {
                app.Shutdown();
            });
            if (!dataContext.Next()) return;

        }


        private Dictionary<string, string>? getArgsParams(IClassicDesktopStyleApplicationLifetime app)
        {
            Dictionary<string, string>? result = null;
            if (app.Args != null && app.Args.Length > 0)
            {
                result = new Dictionary<string, string>();
                string[] items = app.Args[0].Split(';');
                foreach(string item in items)
                {
                    string[] p = item.Split('=');
                    string param = (p.Length > 0 ? p[0].Trim() : string.Empty);
                    string value = (p.Length > 1 ? p[1] : string.Empty);
                    if (!string.IsNullOrEmpty(param) && !result.ContainsKey(param))
                        result.Add(param, value);
                }
            }
            return result;
        }
    }
}
