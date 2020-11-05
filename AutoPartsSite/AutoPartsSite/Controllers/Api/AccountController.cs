using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using AutoPartsSite.Core.Controllers;

namespace AutoPartsSite.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/account")]
    public partial class AccountController : ApiControllerBase<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }
    }
}
