using AutoPartSite.Core.Http;
using AutoPartsSite.Core.Controllers;
using System;
using System.Collections.Generic;
using System.Text;

namespace AutoPartSite.Core.Controllers
{
    public static class ApiControllerBaseExtensions
    {
        public static HttpMessage<P> TryCatch<T, P>(this ApiControllerBase<T> controller, Func<P> func)
        {
            HttpMessage<P> result;
            try
            {
                result = new HttpMessage<P>() { Data = func.Invoke() };
            }
            catch (Exception ex)
            {
                result = new HttpMessage<P>() { Data = default(P), Result = -1, Error = ex.Message };
                controller.WriteError(ex);
            }
            return result;
        }
    }
}
