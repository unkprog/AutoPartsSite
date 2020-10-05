using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
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

        [NonAction]
        public HttpResponseMessage TryCatchResponse(Func<HttpResponseMessage> func)
        {
            try
            {
                return func.Invoke();
            }
            catch (Exception ex)
            {
                WriteError(ex);
                return CreateResponse(HttpStatusCode.InternalServerError, new { Message = ex.Message });
            }
        }

        [NonAction]
        public async Task<HttpResponseMessage> TryCatchResponseAsync(Func<Task<HttpResponseMessage>> func)
        {
            try
            {
                Task<HttpResponseMessage> taskInvoke = func.Invoke();
                return await taskInvoke;
            }
            catch (Exception ex)
            {
                WriteError(ex);
                return CreateResponse(HttpStatusCode.InternalServerError, new { Message = ex.Message });

            }
        }

        [NonAction]
        public HttpResponseMessage CreateResponse(HttpStatusCode statusCode)
        {
            return new HttpResponseMessage(statusCode);
        }

        [NonAction]
        public HttpResponseMessage CreateResponse(HttpStatusCode statusCode, object value)
        {
            return new HttpResponseMessage(statusCode) { Content = new StringContent(Utf8Json.JsonSerializer.NonGeneric.ToJsonString(value)) };
        }
    }
}
