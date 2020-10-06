﻿using System.IO;
using Microsoft.Extensions.Configuration;

namespace AutoPartSite.Accounts
{
    public static class AppSettings
    {
        public static class AccountService
        {
            static IConfiguration settings { get; }
            static AccountService()
            {
                settings = new ConfigurationBuilder()
                        .SetBasePath(Directory.GetCurrentDirectory())
                        .AddJsonFile(@"\\appsettings.json")
                        .Build();
            }
            public static string Server => settings["AccountService:Server"];
            public static string ApiAccount => settings["AccountService:ApiAccount"];

        }
    }
}
