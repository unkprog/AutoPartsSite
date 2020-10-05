using System;
using System.Net.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using System.Net;
using AutoPartsSite.Models;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace AutoPartSite.Accounts.Controllers.Api
{
    public class AccountController : QueryController<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
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

                user user = null;
                for (int i = 0, icount = users.Count; user == null && i < icount; i++)
                {
                    ExecQuery((query) =>
                    {
                        query.Execute(@"user\sec\[get]", new SqlParameter[] { new SqlParameter("@id", users[i].id) }
                        , (values) =>
                        {
                            if (login.pass == (string)values[1])
                                user = users[i];
                        });
                    });
                }

                if (user == null || user.d != 0)
                    throw new Exception("Пользователь не найден.");

                
                return CreateResponse(HttpStatusCode.OK, user);
            });
        }

        [NonAction]
        private List<user> GetUsers(string email)
        {
            List<user> result = new List<user>();
            ExecQuery((query) =>
            {
                query.Execute(@"user\[get]", new SqlParameter[] { new SqlParameter("@field", "email"), new SqlParameter() { ParameterName = "@id", Value = 0 }, new SqlParameter("@email", email) }
                , (values) =>
                {
                    result.Add(new user()
                    {
                        id = (int)values[0],
                        d = (int)values[1],
                        cd = (DateTime)values[2],
                        cu = (int)values[3],
                        ud = (DateTime)values[4],
                        uu = (int)values[5],
                        email = (string)values[6]
                    });
                });
            });
            return result;
        }

        [NonAction]
        private user_sec SetPassword(user user, string email, string subject)
        {
            user_sec user_sec = new user_sec() { id = user.id, pass = GeneratePassword(8) };

            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"user\sec\[set]", new SqlParameter[] { new SqlParameter() { ParameterName = "@id", Value = user_sec.id }, new SqlParameter("@pass", user_sec.pass) });
            });

            //if (!string.IsNullOrEmpty(user.phone))
            //{
            //    string body = string.Concat("Ваш пароль для входа: ", user_sec.pass);
            //    var resultSMS = SMS.SendSMS("https://sms.ru/sms/send?api_id=112D81F5-A8AD-6687-4914-0DD89D0528A0&to=7", user.phone, body);
            //}

            if (!string.IsNullOrEmpty(email))
            {
                string body = string.Concat("Ваш пароль для входа: ", user_sec.pass);
               // Core.Net.EMail.SendEMail(AppSettings.Mail.Address, AppSettings.Mail.Password, email, subject, body);
            }
            return user_sec;
        }

        private static readonly string alphabet = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ01234567899876543210aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ";
        private static readonly Random r = new Random();
        [NonAction]
        public string GeneratePassword(int length)
        {
            if (length < 1 || length > 128)
                throw new ArgumentException("password_length_incorrect", "length");

            var chArray = new char[length];
            var password = string.Empty;
            for (int i = 0; i < length; i++)
            {
                int j = r.Next(alphabet.Length);
                char nextChar = alphabet[j];
                chArray[i] = (nextChar);
            }
            return new string(chArray);
        }
    }
}
