using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Extensions;
using AutoPartSite.Accounts;
using AutoPartSite.Core.Models.Security;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Managers;
using AutoPartsSite.Handlers;
using AutoPartSite.Core.Http;
using Microsoft.AspNetCore.Authorization;

namespace AutoPartsSite.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/account")]
    public class AccountController : ApiControllerBase<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }

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
        public async Task<HttpMessage<object>> Login(LoginUser login)
            => await TryCatchResponseAsync(async () =>
            {
                HttpMessage<User> postResult = await Json.PostAsync<HttpMessage<User>, LoginUser>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/login", login,
                    onError: (e) =>
                    {
                        postResult = CreateResponseError<User>(e);
                    });


                User user = postResult.Data;

                if (user == null)
                       throw new Exception("Невозможно произвести авторизацию!");

                Principal principal = new Principal(user);
                AuthUserManager.LogIn(principal);
                AuthorizationHeaderHandler.SetPrincipal(principal);

                return CreateResponseOk<object>(new { result = "Ok", indetity = new { auth = true, token = principal.GetKey() } });
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
