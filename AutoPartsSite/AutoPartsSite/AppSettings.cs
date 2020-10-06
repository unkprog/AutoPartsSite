using System.IO;
using Microsoft.Extensions.Configuration;

namespace AutoPartSite.Accounts
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
    }
}
