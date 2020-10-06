using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Utf8Json;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Extensions;
using AutoPartSite.Accounts;
using AutoPartSite.Core.Models.Security;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Managers;
using AutoPartsSite.Handlers;

namespace AutoPartsSite.Controllers.Api
{
    public class AccountController : ApiControllerBase<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }

        [HttpPost]
        [ActionName("register")]
        public async Task<HttpResponseMessage> register(register_user register_user)
               => await TryCatchResponseAsync(async () =>
               {
                   HttpResponseMessage postResult = await Json.PostAsync<HttpResponseMessage, register_user>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/register", register_user,
                       onError: (e) =>
                       {
                           postResult = CreateResponse(HttpStatusCode.BadRequest, new { result = "Error", response = e.Message });
                       });
                   return CreateResponse(HttpStatusCode.OK, new { result = "Ok", response = postResult });

               });

        [HttpPost]
        [ActionName("login")]
        public async Task<HttpResponseMessage> login(login_user login)
            => await TryCatchResponseAsync(async () =>
            {
                HttpResponseMessage postResult = await Json.PostAsync<HttpResponseMessage, login_user>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/login", login,
                    onError: (e) =>
                    {
                        postResult = CreateResponse(HttpStatusCode.BadRequest, new { result = "Error", response = e.Message });
                    });

                if (postResult.StatusCode != HttpStatusCode.OK)
                    return CreateResponse(HttpStatusCode.OK, new { result = "Ok", response = postResult });


                var rawData = await postResult.Content.ReadAsStringAsync();
                user user = (user)JsonSerializer.NonGeneric.Deserialize(typeof(user), rawData, JsonSerializer.DefaultResolver);

                if (user == null)
                       throw new Exception("Невозможно произвести авторизацию!");

                Principal principal = new Principal(user);
                AuthUserManager.LogIn(principal);
                AuthorizationHeaderHandler.SetPrincipal(principal);

                return CreateResponse(HttpStatusCode.OK, new { result = "Ok", indetity = new { auth = true, token = principal.GetKey() } });
            });

        [HttpPost]
        [ActionName("recovery")]
        public async Task<HttpResponseMessage> recovery(register_user register_user)
            => await TryCatchResponseAsync(async () =>
            {
                HttpResponseMessage postResult = await Json.PostAsync<HttpResponseMessage, register_user>(AppSettings.AccountService.Server, AppSettings.AccountService.ApiAccount + "/recovery", register_user,
                    onError: (e) =>
                    {
                        postResult = CreateResponse(HttpStatusCode.BadRequest, new { result = "Error", response = e.Message });
                    });
                return CreateResponse(HttpStatusCode.OK, new { result = "Ok", response = postResult });
            });
    }
}
