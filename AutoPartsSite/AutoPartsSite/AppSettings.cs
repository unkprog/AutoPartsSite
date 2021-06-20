using System.IO;
using AutoPartsSite.Core.Sql;
using Microsoft.Extensions.Configuration;

namespace AutoPartsSite
{
    public static partial class AppSettings
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

                public static class Cms
                {
                    static Cms()
                    {
                        Connection = new Connection()
                        {
                            DataSource = Settings["AutoPartsSite.Cms:DataSource"],
                            InitialCatalog = Settings["AutoPartsSite.Cms:InitialCatalog"],
                            IsSSPI = Settings.GetValue<bool>("AutoPartsSite.Cms:IsSSPI"),
                            UserID = Settings["AutoPartsSite.Cms:UserID"],
                            Password = Settings["AutoPartsSite.Cms:Password"]
                        };
                    }
                    public static Connection Connection { get; }

                    public static class Path
                    {
                        public static string Query => string.Concat(PhysicalApplicationPath, Settings["AutoPartsSite.Cms:Path:Query"]);
                    }
                }
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
            public static bool EnableSsl => Settings.GetValue<bool>("Smtp:EnableSsl");

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

        public static class MailAskQuestions
        {
            static IConfiguration Settings { get; }
            static MailAskQuestions()
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
            public static string Address => Settings["Mail:Ask:Address"];
            public static string Password => Settings["Mail:Ask:Password"];
        }
    }
}
