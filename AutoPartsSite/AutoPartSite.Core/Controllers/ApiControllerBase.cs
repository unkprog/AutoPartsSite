using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;


namespace AutoPartsSite.Core.Controllers
{
    [ApiController]
    public class ApiControllerBase<T> : ControllerBase
    {
        protected readonly ILogger<T> _logger;

        public ApiControllerBase(ILogger<T> logger)
        {
            _logger = logger;
        }

        [NonAction]
        public void WriteError(Exception ex)
        {
            _logger?.Log(LogLevel.Error, ex.Message);
        }

    }
}
