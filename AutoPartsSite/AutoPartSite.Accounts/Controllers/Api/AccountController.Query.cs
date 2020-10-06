﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Accounts.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        private List<User> GetUsers(string email)
        {
            List<User> result = new List<User>();
            ExecQuery((query) =>
            {
                query.Execute(@"user\[get]", new SqlParameter[] { new SqlParameter("@field", "email"), new SqlParameter() { ParameterName = "@id", Value = 0 }, new SqlParameter("@email", email) }
                , (values) =>
                {
                    result.Add(new User()
                    {
                        Id = (int)values[0],
                        D = (int)values[1],
                        Cd = (DateTime)values[2],
                        Cu = (int)values[3],
                        Ud = (DateTime)values[4],
                        Uu = (int)values[5],
                        Email = (string)values[6]
                    });
                });
            });
            return result;
        }

        [NonAction]
        public User GetUser(int id)
        {
            User result = null;
            ExecQuery((query) =>
            {
                query.Execute(@"user\[get]", new SqlParameter[] { new SqlParameter("@field", "id"), new SqlParameter("@id", value:id), new SqlParameter("@email", value: string.Empty) }
                 , (values) =>
                 {
                     result = new User()
                     {
                         Id = (int)values[0],
                         D = (int)values[1],
                         Cd = (DateTime)values[2],
                         Cu = (int)values[3],
                         Ud = (DateTime)values[4],
                         Uu = (int)values[5],
                         Email = (string)values[6]
                     };
                 });
            });
            return result;
        }

        [NonAction]
        public User InsertUser(User user)
        {
            int id = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"user\[ins]", sqlParameters: new SqlParameter[] { new SqlParameter("@cu", value: 0), new SqlParameter("@uu", value: 0), new SqlParameter("@email", value: user.Email) }
                , action: (values) =>
                {
                    id = (int)values[0];
                });
            });

            return GetUser(id);
        }

        [NonAction]
        public User_Role InsertUserRole(User_Role user_role)
        {
            User_Role result = new User_Role() { User = user_role.User, Role = user_role.Role };
            ExecQuery((query) =>
            {
                query.Execute(@"user\role\[ins]", sqlParameters: new SqlParameter[] { new SqlParameter("@user", value: result.User), new SqlParameter("@role", value: result.Role) }
                , action: (values) =>
                {
                    result.Id = (int)values[0];
                });
            });

            return result;
        }

        [NonAction]
        private User GetUserByPass(string pass, List<User> users)
        {
            User result = null;
            for (int i = 0, icount = users.Count; result == null && i < icount; i++)
            {
                ExecQuery((query) =>
                {
                    query.Execute(@"user\sec\[get]", new SqlParameter[] { new SqlParameter("@id", value: users[i].Id) }
                        , (values) =>
                        {
                            if (pass == (string)values[1])
                                result = users[i];
                        });
                });
            }
            return result;
        }

        [NonAction]
        private User_Sec SetPassword(User user, string email, string subject)
        {
            User_Sec user_sec = new User_Sec() { Id = user.Id, Pass = GeneratePassword(8) };

            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"user\sec\[set]", new SqlParameter[] { new SqlParameter("@id", value: user_sec.Id), new SqlParameter("@pass", value: user_sec.Pass) });
            });

            //if (!string.IsNullOrEmpty(user.phone))
            //{
            //    string body = string.Concat("Ваш пароль для входа: ", user_sec.pass);
            //    var resultSMS = SMS.SendSMS("https://sms.ru/sms/send?api_id=112D81F5-A8AD-6687-4914-0DD89D0528A0&to=7", user.phone, body);
            //}

            if (!string.IsNullOrEmpty(email))
            {
                string body = string.Concat("Ваш пароль для входа: ", user_sec.Pass);
                Core.Net.EMail.SendEMail(AppSettings.Mail.Address, AppSettings.Mail.Password, email, subject, body);
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
            //var password = string.Empty;
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