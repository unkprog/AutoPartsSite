using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Managers;
using AutoPartsSite.Handlers;
using AutoPartsSite.Core.Http;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

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
