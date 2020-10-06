using System;
using System.Net;
using System.Net.Http;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Accounts.Controllers.Api
{
    public partial class AccountController : QueryController<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }

        [HttpPost]
        [ActionName("login")]
        public HttpResponseMessage login(login_user login)
        {
            return TryCatchResponse(() =>
            {
                if (login == null || string.IsNullOrEmpty(login.email) || string.IsNullOrEmpty(login.pass))
                    throw new Exception("Неверные параметры для входа.");

                List<user> users = GetUsers(login.email);

                if (users == null || users.Count == 0)
                    throw new Exception("Пользователь не найден.");

                user user = GetUserByPass(login.pass, users);

                if (user == null || user.d != 0)
                    throw new Exception("Пользователь не найден.");


                return CreateResponse(HttpStatusCode.OK, user);
            });
        }

        [HttpPost]
        [ActionName("register")]
        public HttpResponseMessage register(register_user register)
        {
            return TryCatchResponse(() =>
            {
                if (register == null)
                    throw new Exception("Неверные параметры авторизации.");

                List<user> users = GetUsers(register.email);

                if (users != null && users.Count > 0)
                    throw new Exception("Пользователь уже зарегистрирован.");

                user user = InsertUser(new user() { email = register.email });
                user_role user_role = InsertUserRole(new user_role() { user = user.id, role = 2 });
                user_sec user_sec = SetPassword(user, string.Empty, "Регистрация в Auto Parts Site");

                return  CreateResponse(HttpStatusCode.OK, user);
            });
        }

        [HttpPost]
        [ActionName("recovery")]
        public HttpResponseMessage recovery(register_user register)
        {
            return TryCatchResponse(() =>
            {
                if (register == null)
                    throw new Exception("Неверные параметры для восстановления.");

                List<user> users = GetUsers(register.email);

                if (users == null || users.Count == 0)
                    throw new Exception("Пользователь не найден.");

                SetPassword(users[0], string.Empty, "Восстановление пароля в Auto Parts Site");

                return this.CreateResponse(HttpStatusCode.OK, new { result = "Ok" });
            });
        }
    }
}
