using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Features;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Managers;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [HttpGet]
        [Route("uid")]
        public async Task<HttpMessage<IdentityResult>> Uid(string uid)
         => await TryCatchResponseAsync(async () =>
         {
             return await Task.Run(() =>
             {
                 Principal principal = Core.Http.HttpContext.Current.User as Principal;
                 UserWithRole user = null;
                 if (principal == null || principal.User == null)
                 {
                     UserUid uu = GetUserUid(uid);
                     HttpMessage<UserWithRole> postResult = Json.Post<HttpMessage<UserWithRole>, UserUid>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/loginCheck", uu);
                     user = postResult?.Data;
                 }
                 else
                     user = (principal.User as UserWithRole);

                 if (principal == null && user != null && user.Id != 0)
                 {
                     principal = new Principal(user);
                     AuthUserManager.LogIn(principal);
                 }

                 int userId = user.Id;
                 int siteUserId = SetUserUid(uid, userId);
                
                 bool Cms = user.Roles != null && user.Roles.Count > 0 && user.Roles.FirstOrDefault(f => f.Role == 1) != null;
                 bool auth = user != null && user.Id != 0;
                 return CreateResponseOk(new IdentityResult { SiteUserId = siteUserId, Auth = auth, Cms = Cms, Token = principal == null ? "" : principal.GetKey(), User = user });
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
