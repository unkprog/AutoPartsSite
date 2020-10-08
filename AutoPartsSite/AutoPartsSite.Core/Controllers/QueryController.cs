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


        [NonAction]
        protected virtual Query CreateQuery()
        {
            throw new NotImplementedException("Необходимо реализовать CreateQuery");
        }

        [NonAction]
        protected void ExecQuery(Action<Query> func)
        {
            using (Query query = CreateQuery())
                func?.Invoke(query);
        }
    }
}
