using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Models.Security;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [HttpGet]
        [Route("uid")]
        public async Task<HttpMessage<int>> Uid(string uid)
         => await TryCatchResponseAsync(async () =>
         {
             return await Task.Run(() =>
             {
                 Principal principal = Core.Http.HttpContext.Current.User as Principal;
                 int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                 int result = SetUserUid(uid, userId);
                 return CreateResponseOk(result);
             });
         });

        [HttpGet]
        [Route("settings")]
        public async Task<HttpMessage<Settings>> Settings()
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Settings result = new Settings();

                  IPAddress remoteIpAddress = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress;
                  string ip = (remoteIpAddress == null || remoteIpAddress.Equals(IPAddress.IPv6Loopback) || remoteIpAddress.Equals(IPAddress.Loopback) ? GetRemoteIPAdress() : remoteIpAddress.ToString());

                  GeoPlugin geo = GetIPGeoPlugin(ip);
                  result.Country = GetCountries(geo.CountryCode, geo.CountryCode).FirstOrDefault();
                  result.Language = GetLanguages(geo.CountryCode, geo.CountryCode).FirstOrDefault();
                  result.Currency = GetCurrencies(geo.CountryCode, geo.CurrencyCode).FirstOrDefault();

                  if (result.Language == null)
                      result.Language = GetLanguages("EN", "EN").FirstOrDefault();

                  return CreateResponseOk(result);
              });
          });

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
