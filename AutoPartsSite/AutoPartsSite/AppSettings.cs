using System.IO;
using AutoPartsSite.Core.Sql;
using Microsoft.Extensions.Configuration;

namespace AutoPartsSite
{
    public static class AppSettings
    {
        public static string PhysicalApplicationPath => Directory.GetCurrentDirectory();

        public static class AccountService
        {
            static IConfiguration Settings { get; }
            static AccountService()
            {
                Settings = new ConfigurationBuilder()
                        .SetBasePath(PhysicalApplicationPath)
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
                    public static string Query => string.Concat(PhysicalApplicationPath, Settings["GlobalParts:Path:Query"]);
                }
            }

            public static class AutoPartsSite
            {
                public static class Basket
                {
                    static Basket()
                    {
                        Connection = new Connection()
                        {
                            DataSource = Settings["AutoPartsSite.Basket:DataSource"],
                            InitialCatalog = Settings["AutoPartsSite.Basket:InitialCatalog"],
                            IsSSPI = Settings.GetValue<bool>("AutoPartsSite.Basket:IsSSPI"),
                            UserID = Settings["AutoPartsSite.Basket:UserID"],
                            Password = Settings["AutoPartsSite.Basket:Password"]
                        };
                    }
                    public static Connection Connection { get; }

                    public static class Path
                    {
                        public static string Query => string.Concat(PhysicalApplicationPath, Settings["AutoPartsSite.Basket:Path:Query"]);
                    }
                }
            }
        }
    }
}
