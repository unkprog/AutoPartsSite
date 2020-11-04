using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Account;
using Microsoft.AspNetCore.Http.Features;
using System.Net;
using System.IO;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        //http://www.geoplugin.net/json.gp?ip=89.163.220.14
        [HttpGet]
        [Route("settingsdata")]
        public async Task<HttpMessage<Settings>> SettingsData(string lang)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  var ip = GetDebugIPAdress();
                  var remoteIpAddress = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress;
                  Settings result = new Settings();
                  result.Countries = GetCountries(lang);
                  result.Languages = GetLanguages(lang);
                  result.Currencies = GetCurrencies(lang);
                  return CreateResponseOk(result);
              });
          });

        [NonAction]
        string GetDebugIPAdress()
        {
            string result = "127.0.0.1";
            var req = WebRequest.Create(@"http://checkip.dyndns.org");
            {
                using (var reader = new StreamReader(req.GetResponse().GetResponseStream()))
                {
                    result = reader.ReadToEnd();
                }
            }
            return result;
        }
    }
}
