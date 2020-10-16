using System;
using AutoPartsSite.Core.Sql;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

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
            func?.Invoke(CreateQuery());
        }
    }
}
