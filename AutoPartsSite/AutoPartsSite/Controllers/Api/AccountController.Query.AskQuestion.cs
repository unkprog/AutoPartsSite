using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Models.GlobalParts;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        private List<AskQuestion> GetAskQuestions(string email, int userId)
        {
            List<AskQuestion> result = new List<AskQuestion>();
            AppSettings.Query.Basket.Execute(@"AskQuestion\[get]"
            , new SqlParameter[]
            {
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Email", email)
            }
            , null
            , (values) =>
            {
                result.Add(new AskQuestion()
                {
                    Id = values[0].ToInt(),
                    Date = values[1].ToDateTime(),
                    Name = values[2].ToStr(),
                    Email = values[3].ToStr(),
                    Question = values[4].ToStr(),
                    ParentId = values[5].ToInt(),
                    UserId = values[6].ToInt()
                });
            });

            return result;
        }
    }
}
