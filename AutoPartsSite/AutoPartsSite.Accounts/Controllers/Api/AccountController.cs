using System;
using System.Net;
using System.Net.Http;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Models.Account;
using Microsoft.AspNetCore.Authorization;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Security;

namespace AutoPartsSite.Accounts.Controllers.Api
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
        public HttpMessage<UserWithRole> Login(LoginUser login)
        {
            return TryCatchResponse(() =>
            {
                if (login == null || string.IsNullOrEmpty(login.Email) || string.IsNullOrEmpty(login.Pass))
                    throw new Exception("Неверные параметры для входа.");

                List<User> users = GetUsers(login.Email);

                if (users == null || users.Count == 0)
                    throw new Exception("Пользователь не найден.");

                User user = GetUserByPass(Password.ComputeHash(login.Pass), users);

                if (user == null || user.D != 0)
                    throw new Exception("Пользователь не найден.");

                UserWithRole result = new UserWithRole() { Id = user.Id, Email = user.Email };
                result.Roles = GetUserRoles(user.Id);

                return CreateResponseOk(result);
            });
        }

        [HttpPost]
        [Route("loginCheck")]
        public HttpMessage<UserWithRole> LoginCheck(UserUid uu)
        {
            return TryCatchResponse(() =>
            {
                UserWithRole result = new UserWithRole() { Id = uu.User };
                User user = GetUser(uu.User);

                if (user != null && user.D == 0)
                {
                    result.Email = user.Email;
                    result.Roles = GetUserRoles(user.Id);
                }
                return CreateResponseOk(result);
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
                User_Sec user_sec = SetPassword(user, user.Email, null, "Регистрация в Auto Parts Site");

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

                SetPassword(users[0], users[0].Email, null, "Восстановление пароля в Auto Parts Site");

                return CreateResponseOk("Ok");
            });
        }

        [HttpPost]
        [Route("changepass")]
        public HttpMessage<string> ChangePass(ProfileUser profile_user)
        {
            return TryCatchResponse(() =>
            {
                if (profile_user == null || string.IsNullOrEmpty(profile_user.Email))
                    throw new Exception("Неверные параметры для изменения пароля.");

                List<User> users = GetUsers(profile_user.Email);

                if (users == null || users.Count == 0)
                    throw new Exception("Пользователь не найден.");

                User user = GetUserByPass(Password.ComputeHash(profile_user.Pass), users);
                if (user == null)
                    throw new Exception("Неверно указан пароль.");

                if(string.IsNullOrEmpty(profile_user.ChangePass))
                    throw new Exception("Не указан новый пароль.");

                switch (Password.Check(profile_user.ChangePass))
                {
                    case 1: throw new Exception("Пароль слишком короткий.");
                    case 2: throw new Exception("Не указан хотя бы один заглавный символ.");
                    case 3: throw new Exception("Не указан хотя бы один прописной символ.");
                    case 4: throw new Exception("Не указана хотя бы одна цифра.");
                    default: break;
                }

                SetPassword(users[0], users[0].Email, profile_user.ChangePass, "Изменение пароля в Auto Parts Site");

                return CreateResponseOk("Ok");
            });
        }
    }
}
