using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Cms;
using System.Collections.Generic;

namespace AutoPartsSite.Controllers.Api
{
    [Route("api/cms")]
    public partial class CmsController : QueryController<CmsController>
    {
        public CmsController(ILogger<CmsController> logger) : base(logger)
        {
        }
    }
}
