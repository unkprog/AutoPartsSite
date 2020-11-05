using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Account;
using Microsoft.AspNetCore.Http.Features;
using System.Net;
using System.IO;
using System.Text.RegularExpressions;
using Utf8Json;
using System.Linq;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        //  
        [HttpGet]
        [Route("settingsdata")]
        public async Task<HttpMessage<SettingsData>> SettingsData(string lang, bool isSetup)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  SettingsData result = new SettingsData();

                  IPAddress remoteIpAddress = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress;
                  string ip = (remoteIpAddress == null || remoteIpAddress.Equals(IPAddress.IPv6Loopback) || remoteIpAddress.Equals(IPAddress.Loopback) ? GetRemoteIPAdress(): remoteIpAddress.ToString()) ;
                  if (isSetup)
                  {
                      GeoPlugin geo = GetIPGeoPlugin(ip);
                      result.Current = new Settings()
                      {
                          Country = GetCountries(lang, geo.CountryCode).FirstOrDefault(),
                          Language = GetLanguages(lang, geo.CountryCode).FirstOrDefault(),
                          Currency = GetCurrencies(lang, geo.CurrencyCode).FirstOrDefault()
                      };
                  }
                
                  result.Countries = GetCountries(lang);
                  result.Languages = GetLanguages(lang);
                  result.Currencies = GetCurrencies(lang);
                  return CreateResponseOk(result);
              });
          });

       
    }
}
