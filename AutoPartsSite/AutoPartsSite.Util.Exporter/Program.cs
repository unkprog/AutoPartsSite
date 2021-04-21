using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Util.Exporter.Models;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.ReactiveUI;
using System;
using System.Collections.Generic;
using System.Threading;

namespace AutoPartsSite.Util.Exporter
{
    class Program
    {
        internal static AppArgsModel argsModel = new AppArgsModel();
        internal static Dictionary<string, string> dictArgs = new Dictionary<string, string>();
        internal static bool IsFinish = false;
        // Initialization code. Don't use any Avalonia, third-party APIs or any
        // SynchronizationContext-reliant code before AppMain is called: things aren't initialized
        // yet and stuff might break.
        public static int Main(string[] args)
        {
            Console.WriteLine(DateTime.Now.ToString("dd.MM.yyyy HH:mm:ss") + ": Start...");

            dictArgs = getArgsParams(args);
            argsModel = getAppArgsModel(dictArgs!);

            if (argsModel.NoUI)
            {
                App.runWithArgs(null, new Views.MainWindowViewModel(), argsModel);
                while (!IsFinish)
                {
                    Thread.Sleep(500);
                }
                return 0;
            }
            else
                return BuildAvaloniaApp().StartWithClassicDesktopLifetime(args);
        }

        // Avalonia configuration, don't remove; also used by visual designer.
        public static AppBuilder BuildAvaloniaApp()
            => AppBuilder.Configure<App>()
                .UsePlatformDetect()
                .LogToTrace()
                .UseReactiveUI();


        private static AppArgsModel getAppArgsModel(Dictionary<string, string> args)
        {
            AppArgsModel result = new AppArgsModel();

            if (args.ContainsKey("noui")) result.NoUI = args["noui"] == "true";

            if (args.ContainsKey("server")) result.Server = args["server"];

            if (args.ContainsKey("server")) result.Server = args["server"];
            if (args.ContainsKey("sspi")) result.IsSSPI = args["sspi"] == "true";
            if (!result.IsSSPI)
            {
                if (args.ContainsKey("user")) result.User = args["user"];
                if (args.ContainsKey("login")) result.Login = args["login"];
            }
            if (args.ContainsKey("db")) result.Db = args["db"];

            if (args.ContainsKey("company")) result.Company = args["company"].ToInt();
            if (args.ContainsKey("agreement")) result.Agreement = args["agreement"].ToInt();

            return result;
        }

        private static Dictionary<string, string>? getArgsParams(string[] args)
        {
            Dictionary<string, string> result = new Dictionary<string, string>();
            if (args != null && args.Length > 0)
            {
                
                string[] items = args[0].Split(';');
                foreach (string item in items)
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
