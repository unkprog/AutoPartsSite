using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Accounts.Controllers.Api
{
    public partial class AccountController
    {
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

        public user GetUser(int id)
        {
            user result = null;
            ExecQuery((query) =>
            {
                query.Execute(@"user\[get]", new SqlParameter[] { new SqlParameter("@field", "id"), new SqlParameter() { ParameterName = "@id", Value = 0 }, new SqlParameter("@email", string.Empty) }
                 , (values) =>
                 {
                     result = new user()
                     {
                         id = (int)values[0],
                         d = (int)values[1],
                         cd = (DateTime)values[2],
                         cu = (int)values[3],
                         ud = (DateTime)values[4],
                         uu = (int)values[5],
                         email = (string)values[6]
                     };
                 });
            });
            return result;
        }


        public user InsertUser(user user)
        {
            int id = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"user\[ins]", sqlParameters: new SqlParameter[] { new SqlParameter("@cu", 0), new SqlParameter("@uu", 0), new SqlParameter("@email", user.email) }
                , action: (values) =>
                {
                    id = (int)values[0];
                });
            });

            return GetUser(id);
        }

        public user_role InsertUserRole(user_role user_role)
        {
            user_role result = new user_role() { user = user_role.user, role = user_role.role };
            ExecQuery((query) =>
            {
                query.Execute(@"user\role\[ins]", sqlParameters: new SqlParameter[] { new SqlParameter("@user", result.user), new SqlParameter("@role", result.role) }
                , action: (values) =>
                {
                    result.id = (int)values[0];
                });
            });

            return result;
        }

        private user GetUserByPass(string pass, List<user> users)
        {
            user result = null;
            for (int i = 0, icount = users.Count; result == null && i < icount; i++)
            {
                ExecQuery((query) =>
                {
                    query.Execute(@"user\sec\[get]", new SqlParameter[] { new SqlParameter("@id", users[i].id) }
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
