using System;
using System.Threading.Tasks;
using AutoPartsSite.Core.Http;
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
        public HttpMessage<T> TryCatchResponse<T>(Func<HttpMessage<T>> func)
        {
            try
            {
                return func.Invoke();
            }
            catch (Exception ex)
            {
                WriteError(ex);
                return CreateResponseError<T>(ex);
            }
        }

        [NonAction]
        public async Task<HttpMessage<T>> TryCatchResponseAsync<T>(Func<Task<HttpMessage<T>>> func)
        {
            try
            {
                Task<HttpMessage<T>> taskInvoke = func.Invoke();
                return await taskInvoke;
            }
            catch (Exception ex)
            {
                WriteError(ex);
                return CreateResponseError<T>(ex);

            }
        }

        //[NonAction]
        //public HttpResponseMessage CreateResponse(HttpStatusCode statusCode)
        //{
        //    return new HttpResponseMessage(statusCode);
        //}

        [NonAction]
        public HttpMessage<T> CreateResponse<T>(int result, T data, string error = "")
        {
            return new HttpMessage<T>() { Result = result, Data = data, Error = error };
        }

        [NonAction]
        public HttpMessage<T> CreateResponseOk<T>(T data)
        {
            return new HttpMessage<T>() { Result = 0, Data = data };
        }

        [NonAction]
        public HttpMessage<T> CreateResponseError<T>(Exception ex)
        {
            return new HttpMessage<T>() { Result = -1, Data = default, Error = ex?.Message };
        }
    }
}
