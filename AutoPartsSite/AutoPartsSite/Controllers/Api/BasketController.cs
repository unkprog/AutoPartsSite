using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;

namespace AutoPartsSite.Controllers.Api
{

    [AllowAnonymous]
    [Route("api/basket")]
    public partial class BasketController : QueryController<SearchController>
    {
        public BasketController(ILogger<SearchController> logger) : base(logger)
        {
        }
    }
}
