using AutoPartsSite.Core.Sql;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    public partial class NewsController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return AppSettings.Query.Cms;
        }
    }
}
