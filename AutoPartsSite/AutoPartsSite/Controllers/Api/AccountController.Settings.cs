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
using System.Reflection;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [HttpGet]
        [Route("ver")]
        public async Task<HttpMessage<VersionResult>> Version(string uid)
         => await TryCatchResponseAsync(async () =>
         {
             return await Task.Run(() =>
             {
                 string version = this.GetType().Assembly.GetCustomAttribute<AssemblyFileVersionAttribute>().Version;
                 return CreateResponseOk(new VersionResult() { Version = version });
             });
         });

        [HttpGet]
        [Route("uid")]
        public async Task<HttpMessage<UidResult>> Uid(string uid)
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
                 string version = this.GetType().Assembly.GetCustomAttribute<AssemblyFileVersionAttribute>().Version;
                 return CreateResponseOk(new UidResult () { Version = version, Identity = new IdentityResult { SiteUserId = siteUserId, Auth = auth, Cms = Cms, Token = principal == null ? "" : principal.GetKey(), User = user } });
             });
         });

        [HttpGet]
        [Route("settings")]
        public async Task<HttpMessage<Settings>> Settings()
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Settings result = GetDefautSettings(HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress);
                  return CreateResponseOk(result);
              });
          });

        [HttpGet]
        [Route("settingsdata")]
        public async Task<HttpMessage<SettingsData>> SettingsData(int langId, bool isSetup)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  SettingsData result = new SettingsData();
                  if (isSetup)
                      result.Current = GetDefautSettings(HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress);
                
                  result.Countries = GetCountries(langId);
                  result.Languages = GetLanguages(langId, 0);
                  result.Currencies = GetCurrencies(langId);
                  return CreateResponseOk(result);
              });
          });

       
        
    }
}
