using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models;

namespace AutoPartsSite.Controllers.Api
{
    public class AccountController : ApiControllerBase<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }

        //[HttpPost]
        //[ActionName("register")]
        //public async Task<HttpResponseMessage> register(register_user register_user)
        //       => await TryCatchResponseAsync(async () =>
        //       {
        //           return await CheckResponseError(
        //       async () => await Common.Net.Json.PostAsync<JObject, register_user>(AppSettings.Server.Register, "api/account/register", register_user)
        //           , (response) =>
        //                                                  {
        //                                                      HttpRegisterMessage registerMessage = response.ToObject<HttpRegisterMessage>();
        //                                                      Database.CreateDatabase(registerMessage.server.ConnectionString(), registerMessage.database.catalog);
        //                                                      Database.CreateDatabaseUser(registerMessage.server.ConnectionString(), registerMessage.database.catalog, registerMessage.database.user, registerMessage.database.pass);
        //                                                      string path = string.Concat(HostingEnvironment.ApplicationPhysicalPath, AppSettings.Database.Path.Sql);
        //                                                      Database.CreateTables(path, registerMessage.database.ConnectionString(registerMessage.server));
        //                                                      return this.CreateResponse(HttpStatusCode.OK, new { result = "Ok", response });
        //                                                  });
        //       });

        //[HttpPost]
        //[ActionName("login")]
        //public async Task<HttpResponseMessage> login(login_user login)
        //=> await TryCatchResponseAsync(async () =>
        //{
        //    return await CheckResponseError(
        //        async () => await Common.Net.Json.PostAsync<JObject, login_user>(AppSettings.Server.Register, "api/account/login", login)
        //            , (response) =>
        //            {
        //                user User = response.ToObject<user>();
        //                if (User == null)
        //                    throw new Exception("Невозможно произвести авторизацию!");
        //                //// TODO: Добавить проверку Expires!!!
        //                Principal principal = new Principal(principalData);
        //                AuthUser.LogIn(principal);
        //                AuthorizationHeaderHandler.SetPrincipal(principal);
        //                return TryCatchResponseQuery((query) =>
        //                {
        //                    return this.CreateResponse(HttpStatusCode.OK, new { result = "Ok", indetity = new { auth = true, token = principal.GetKey(), employee = AccountData(query, principal) } });
        //                });
        //            });
        //});


        ////internal static employeecard AccountData(Query query, Principal principal)
        ////{
        ////    employee empl = new employee(principal.Data);
        ////    empl = Employee.GetEmployee(query, empl);
        ////    empl = Employee.GetEmployeeSalepointAccess(query, empl);
        ////    employeecard result = new employeecard(empl);
        ////    return result;
        ////}

        //[HttpPost]
        //[ActionName("recovery")]
        //public async Task<HttpResponseMessage> recovery(register_user register_user)
        //=> await TryCatchResponseAsync(async () =>
        //{
        //    var resultPost = await Common.Net.Json.PostAsync<object, register_user>(AppSettings.Server.Register, "api/account/recovery", register_user);
        //    return this.CreateResponse(HttpStatusCode.OK, resultPost);
        //});
    }
}
