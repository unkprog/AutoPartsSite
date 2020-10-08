using AutoPartsSite.Core.Sql;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;

namespace AutoPartsSite.Core.Controllers
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
        protected virtual void ExecQuery(Action<Query> func)
        {
        }
    }
}
