using System;
using System.Net;
using System.Net.Http;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Models.Account;
using Microsoft.AspNetCore.Authorization;
using AutoPartSite.Core.Http;

namespace AutoPartSite.Accounts.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/account")]
    public partial class AccountController : QueryController<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("test")]
        public HttpMessage<string> Test()
        {
            return CreateResponseOk("Test OK");
        }
           
        [HttpPost]
        [Route("login")]
        public HttpMessage<User> Login(LoginUser login)
        {
            return TryCatchResponse(() =>
            {
                if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Pass))
                    throw new Exception("Неверные параметры для входа.");

                List<User> users = GetUsers(login.Email);

                if (users == null || users.Count == 0)
                    throw new Exception("Пользователь не найден.");

                User user = GetUserByPass(login.Pass, users);

                if (user == null || user.D != 0)
                    throw new Exception("Пользователь не найден.");


                return CreateResponseOk(user);
            });
        }

        [HttpPost]
        [Route("register")]
        public HttpMessage<User> Register(RegisterUser register)
        {
            return TryCatchResponse(() =>
            {
                if (register == null || string.IsNullOrEmpty(register.Email))
                    throw new Exception("Неверные параметры регистрации.");

                List<User> users = GetUsers(register.Email);

                if (users != null && users.Count > 0)
                    throw new Exception("Пользователь уже зарегистрирован.");

                User user = InsertUser(new User() { Email = register.Email });
                User_Role user_role = InsertUserRole(new User_Role() { User = user.Id, Role = 2 });
                User_Sec user_sec = SetPassword(user, user.Email, "Регистрация в Auto Parts Site");

                return CreateResponseOk(user);
            });
        }

        [HttpPost]
        [Route("recovery")]
        public HttpMessage<string> Recovery(RegisterUser register)
        {
            return TryCatchResponse(() =>
            {
                if (register == null || string.IsNullOrEmpty(register.Email))
                    throw new Exception("Неверные параметры для восстановления пароля.");

                List<User> users = GetUsers(register.Email);

                if (users == null || users.Count == 0)
                    throw new Exception("Пользователь не найден.");

                SetPassword(users[0], users[0].Email, "Восстановление пароля в Auto Parts Site");

                return CreateResponseOk("Ok");
            });
        }
    }
}
