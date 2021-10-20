using AutoPartsSite.Models.GlobalParts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    public partial class SearchController
    {
        [NonAction]
        internal static void SetAskQuestion(AskQuestion q)
        {
            AppSettings.Query.Basket.ExecuteNonQuery(@"AskQuestion\[create]", new SqlParameter[]
            {
                new SqlParameter("@Name", string.IsNullOrEmpty(q.Name) ? string.Empty : (q.Name.Length > 100 ? q.Name.Substring(0, 100) : q.Name)),
                new SqlParameter("@Email", string.IsNullOrEmpty(q.Email) ? string.Empty : (q.Email.Length > 100 ? q.Email.Substring(0, 100) : q.Email)),
                new SqlParameter("@Question", string.IsNullOrEmpty(q.Question) ? string.Empty : (q.Question.Length > 3700 ? q.Question.Substring(0, 3700) : q.Question)),
                new SqlParameter("@ParentId", q.ParentId),
                new SqlParameter("@UserId", q.UserId),
                new SqlParameter("@ReplyId", q.ReplyId)
            });
        }



    }
}
