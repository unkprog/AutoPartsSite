using System.Linq;
using System.IO;
using System.Net;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.Account;
using Utf8Json;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        private string GetRemoteIPAdress()
        {
            string result = "127.0.0.1", html = "";
            TryCatch(() =>
            {
                var req = WebRequest.Create(@"http://checkip.dyndns.org");
                {
                    using (var reader = new StreamReader(req.GetResponse().GetResponseStream()))
                    {
                        html = reader.ReadToEnd();
                    }
                }
                Regex ipRegex = new Regex(@"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b");
                MatchCollection matches = ipRegex.Matches(html);
                if (matches.Count > 0)
                    result = matches[0].Value;
            });
            return result;
        }

        [NonAction]
        private GeoPlugin GetIPGeoPlugin(string ip)
        {
            GeoPlugin result = null;

            TryCatch(() =>
            {
                string data = "";
                var req = WebRequest.Create(@"http://www.geoplugin.net/json.gp?ip=" + ip);
                {
                    using (var reader = new StreamReader(req.GetResponse().GetResponseStream()))
                    {
                        data = reader.ReadToEnd();
                    }
                }
                result = JsonSerializer.Deserialize<GeoPlugin>(data);
                if(result.Status != 200)
                {
                    if (string.IsNullOrEmpty(result.CountryCode))
                        result.CountryCode = "EN";
                    if (string.IsNullOrEmpty(result.CurrencyCode))
                        result.CurrencyCode = "USD";
                }
            },
            (ex) =>
            {
                result = new GeoPlugin() { CountryCode = "EN", CurrencyCode = "USD" };
            });
            return result;
        }


        internal Settings GetDefautSettings(IPAddress remoteIpAddress)
        {
            Settings result = new Settings();

            string ip = (remoteIpAddress == null || remoteIpAddress.Equals(IPAddress.IPv6Loopback) || remoteIpAddress.Equals(IPAddress.Loopback) ? GetRemoteIPAdress() : remoteIpAddress.ToString());

            GeoPlugin geo = GetIPGeoPlugin(ip);

            result.Language = GetLanguages(0, 0, string.IsNullOrEmpty(geo.CountryCode) ? "EN" : geo.CountryCode).FirstOrDefault();
            if (result.Language == null)
                result.Language = GetLanguages(0, 0, "EN").FirstOrDefault();
            if (result.Language == null)
                result.Language = new Models.GlobalParts.Lang() { Id = 0, Code = "EN", Name = "English" };

            result.Country = GetCountries(result.Language.Id, 0, string.IsNullOrEmpty(geo.CountryCode) ? "US" : geo.CountryCode.ToLower() == "en" ? "US" : geo.CountryCode).FirstOrDefault();
            result.Currency = GetCurrencies(result.Language.Id, 0, string.IsNullOrEmpty(geo.CurrencyCode) ? "USD" : geo.CurrencyCode).FirstOrDefault();

            return result;
        }
    }
}
