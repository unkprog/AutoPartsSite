using AutoPartSite.Core.Http;
using AutoPartSite.Core.Sql;
using AutoPartsSite.Core.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net.Http;

namespace AutoPartSite.Accounts.Controllers.Api
{
    public class QueryController<T> : ApiControllerBase<T>
    {
        public QueryController(ILogger<T> logger) : base(logger)
        {
        }
        public string PhysicalApplicationPath => Directory.GetCurrentDirectory();

        [NonAction]
        protected Query CreateQuery(string connectionString, string path)
        {
            return new Query(connectionString, string.Concat(PhysicalApplicationPath, path));
        }

        [NonAction]
        protected void ExecQuery(Action<Query> func)
        {
            using (Query query = CreateQuery(AppSettings.Database.Connection.ConnectionString, AppSettings.Database.Path.Query))
                func?.Invoke(query);
        }
    }
}
