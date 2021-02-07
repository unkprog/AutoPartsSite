using AutoPartsSite.Core.Sql;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace AutoPartsSite.Accounts
{
    public static class AppSettings
    {
        public static class Database
        {
            private static IConfiguration Settings { get; }
            static Database()
            {
                Settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile(@"\\Database\\connection.json")
                        .Build();

                Connection = new Connection()
                {
                    DataSource = Settings["DataSource"],
                    InitialCatalog = Settings["InitialCatalog"],
                    IsSSPI = Settings.GetValue<bool>("IsSSPI"),
                    UserID = Settings["UserID"],
                    Password = Settings["Password"]
                };
            }

            public static Connection Connection { get; }

            public static class Path
            {
                public static string Query => Settings["Path:Query"];
            }
        }
    
        public static class Smtp
        {
            static IConfiguration Settings { get; }
            static Smtp()
            {
                Settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
#if DEBUG
                        .AddJsonFile(@"\\appsettings.jsn")
#else
                        .AddJsonFile(@"\\appsettings.json")
#endif
                        .Build();
            }
            public static string Host => Settings["Smtp:Host"];
            public static int Port => Settings.GetValue<int>("Smtp:Port");
        }

        public static class Mail
        {
            static IConfiguration Settings { get; }
            static Mail()
            {
                Settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
#if DEBUG
                        .AddJsonFile(@"\\appsettings.jsn")
#else
                        .AddJsonFile(@"\\appsettings.json")
#endif
                        .Build();
            }
            public static string Address => Settings["Mail:Address"];
            public static string Password => Settings["Mail:Password"];
        }
    }
}
