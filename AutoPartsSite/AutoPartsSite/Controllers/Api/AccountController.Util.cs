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
            return result;
        }

        [NonAction]
        private GeoPlugin GetIPGeoPlugin(string ip)
        {
            string result = "";
            var req = WebRequest.Create(@"http://www.geoplugin.net/json.gp?ip=" + ip);
            {
                using (var reader = new StreamReader(req.GetResponse().GetResponseStream()))
                {
                    result = reader.ReadToEnd();
                }
            }
            return JsonSerializer.Deserialize<GeoPlugin>(result);
        }
    }
}
