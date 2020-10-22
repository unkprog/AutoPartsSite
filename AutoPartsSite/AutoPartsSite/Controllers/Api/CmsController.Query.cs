using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Models.Cms;
using System.Data.SqlClient;
using System;

namespace AutoPartsSite.Controllers.Api
{
    public partial class CmsController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return AppSettings.Query.Cms;
        }


        [NonAction]
        private PageEdit GetPageEdit(string page)
        {
            PageEdit result = null;
            ExecQuery((query) =>
            {
                query.Execute(@"Cms\[get_page]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Page", Value = page }
                }
                , (values) =>
                {
                    result = new PageEdit()
                    {
                        Id = (int)values[0],
                        Page = (string)values[1],
                        ContentEn = string.Empty,
                        ContentRu = string.Empty
                    };
                });
            });
            return result;
        }

        [NonAction]
        private PageEdit GetPageEditContent(PageEdit page)
        {
            PageEdit result = page;
            result.ContentEn = string.Empty;
            result.ContentRu = string.Empty;

            ExecQuery((query) =>
            {
                query.Execute(@"Cms\[get_page_content]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Id", Value = page.Id }
                }
                , (values) =>
                {
                    string content = values[2] == DBNull.Value ? string.Empty : (string)values[2];
                    if (!string.IsNullOrEmpty(content))
                        result.ContentEn = string.Concat(result.ContentEn, content);

                    content = values[3] == DBNull.Value ? string.Empty : (string)values[3];
                    if (!string.IsNullOrEmpty(content))
                        result.ContentRu = string.Concat(result.ContentRu, content);
                });
            });
            return result;
        }
    }
}
