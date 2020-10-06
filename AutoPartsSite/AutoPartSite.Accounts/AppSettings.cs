using AutoPartSite.Core.Sql;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace AutoPartSite.Accounts
{
    public static class AppSettings
    {
        public static class Database
        {
            static IConfiguration settings { get; }
            static Database()
            {
                settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile(@"\\Database\\connection.json")
                        .Build();

                Connection = new Connection()
                {
                    DataSource = settings["DataSource"],
                    InitialCatalog = settings["InitialCatalog"],
                    IsSSPI = settings.GetValue<bool>("IsSSPI"),
                    UserID = settings["UserID"],
                    Password = settings["Password"]
                };
            }

            public static Connection Connection { get; }

            public static class Path
            {
                public static string Query => settings["Path:Query"];
            }
        }
    
        public static class Mail
        {
            static IConfiguration settings { get; }
            static Mail()
            {
                settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile(@"\\appsettings.json")
                        .Build();
            }
            public static string Address => settings["Mail:Address"];
            public static string Password => settings["Mail:Password"];
        }
    }
}
