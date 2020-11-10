using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Managers;
using AutoPartsSite.Handlers;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [HttpPost]
        [Route("register")]
        public async Task<HttpMessage<User>> Register(RegisterUser register_user)
               => await TryCatchResponseAsync(async () =>
               {
                   HttpMessage<User> result = await Json.PostAsync<HttpMessage<User>, RegisterUser>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/register", register_user,
                       onError: (e) =>
                       {
                           result = CreateResponseError<User>(e);
                       });
                   return result;

               });

        [HttpPost]
        [Route("login")]
        public async Task<HttpMessage<IdentityResult>> Login(LoginUser login)
            => await TryCatchResponseAsync(async () =>
            {
                HttpMessage<UserWithRole> postResult = await Json.PostAsync<HttpMessage<UserWithRole>, LoginUser>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/login", login,
                    onError: (e) =>
                    {
                        postResult = CreateResponseError<UserWithRole>(e);
                    });


                UserWithRole user = postResult?.Data;

                if (user == null)
                    throw new Exception("Невозможно произвести авторизацию!");

                Principal principal = new Principal(user);
                AuthUserManager.LogIn(principal);
                AuthorizationHeaderHandler.SetPrincipal(principal);
                int siteId = SetUserUid(login.Uid, user.Id);

                bool Cms = user.Roles != null && user.Roles.Count > 0 && user.Roles.FirstOrDefault(f => f.Role == 1) != null;

                return CreateResponseOk(new IdentityResult { SiteId = siteId, Auth = true, Cms = Cms, Token = principal.GetKey(), User = user });
            });

        [HttpPost]
        [Route("recovery")]
        public async Task<HttpMessage<string>> Recovery(RegisterUser register_user)
            => await TryCatchResponseAsync(async () =>
            {
                HttpMessage<string> result = await Json.PostAsync<HttpMessage<string>, RegisterUser>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/recovery", register_user,
                    onError: (e) =>
                    {
                        result = CreateResponseError<string>(e);
                    });
                return result;
            });
    }
}
