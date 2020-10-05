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
            }

            public static Connection Connection => new Connection() 
            { 
                DataSource = settings["DataSource"],
                InitialCatalog = settings["InitialCatalog"],
                IsSSPI = settings.GetValue<bool>("IsSSPI"),
                UserID = settings["UserID"],
                Password = settings["Password"]
            };

            public static class Path
            {
                public static string Query => settings["Path:Query"];
            }
        }
    }
}
