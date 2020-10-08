using System.IO;
using AutoPartsSite.Core.Sql;
using Microsoft.Extensions.Configuration;

namespace AutoPartsSite
{
    public static class AppSettings
    {
        public static class AccountService
        {
            static IConfiguration Settings { get; }
            static AccountService()
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
            public static string Server => Settings["AccountService:Server"];
            public static string ApiAccount => Settings["AccountService:ApiAccount"];

        }

        public static class Database
        {
            private static IConfiguration Settings { get; }
            static Database()
            {
                Settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile(@"\\Database\\connection.json")
                        .Build();
            }

            public static class GlobalParts
            {
                static GlobalParts()
                {
                    Connection = new Connection()
                    {
                        DataSource = Settings["GlobalParts:DataSource"],
                        InitialCatalog = Settings["GlobalParts:InitialCatalog"],
                        IsSSPI = Settings.GetValue<bool>("GlobalParts:IsSSPI"),
                        UserID = Settings["GlobalParts:UserID"],
                        Password = Settings["GlobalParts:Password"]
                    };
                }
                public static Connection Connection { get; }

                public static class Path
                {
                    public static string Query => Settings["GlobalParts:Path:Query"];
                }
            }
        }
    }
}
