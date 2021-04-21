using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using AutoPartsSite.Util.Exporter.Views;
using System.Collections.Generic;
using AutoPartsSite.Core.Extensions;
using Avalonia.Threading;
using System;
using AutoPartsSite.Util.Exporter.Models;

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
               
                MainWindowViewModel dataContext = new MainWindowViewModel();

                if (!Program.argsModel.NoUI)
                {
                    MainWindow mainWindow = new MainWindow { DataContext = dataContext };
                    desktop.MainWindow = mainWindow;
                }
                if (Program.dictArgs != null && Program.dictArgs.Count > 0)
                    runWithArgs(desktop, dataContext, Program.argsModel);
            }

            base.OnFrameworkInitializationCompleted();
        }

        internal static void runWithArgs(IClassicDesktopStyleApplicationLifetime? app, MainWindowViewModel dataContext, AppArgsModel args)
        {
            //server=.;sspi=true;user=sa;login=1;db=GlobalParts;company=12;agreement=7
            if (args == null) return;

            ConnectViewModel? cvm = dataContext.CurrentContent as ConnectViewModel;
            if (cvm == null) return;

            if(Program.dictArgs.ContainsKey("server")) cvm.Connection.DataSource = args.Server;
            if (Program.dictArgs.ContainsKey("sspi")) cvm.Connection.IsSSPI = args.IsSSPI;
            if (!cvm.Connection.IsSSPI)
            {
                if (Program.dictArgs.ContainsKey("user")) cvm.Connection.UserID = args.User;
                if (Program.dictArgs.ContainsKey("login")) cvm.Connection.Password = args.Login;
            }
            if (Program.dictArgs.ContainsKey("db")) cvm.Connection.InitialCatalog = args.Db;

            if (!dataContext.Next()) return;

            SelectAgreementsViewModel? savm = dataContext.CurrentContent as SelectAgreementsViewModel;
            if (savm == null) return;

            savm.SelectOneRecordAgreements(args.Company, args.Agreement);

            if (args.NoUI)
                dataContext.onEndExport = () =>
                {
                    Console.WriteLine(DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss") + ": Finish...");
                    Program.IsFinish = true;
                };
            else
                dataContext.onEndExport = () => Dispatcher.UIThread.InvokeAsync((Action)delegate ()
                {
                    Console.WriteLine(DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss") + ": Finish...");
                    Program.IsFinish = true;
                    if (app != null)
                        app.Shutdown(0);
                });

            if (!dataContext.Next()) return;
        }

    }
}
