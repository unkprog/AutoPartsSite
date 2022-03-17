using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/nativebridge")]
    public class NativeBridgeController : ApiControllerBase<NativeBridgeController>
    {
        public NativeBridgeController(ILogger<NativeBridgeController> logger) : base(logger)
        {
        }


        [HttpPost]
        [Route("command")]
        public async Task<HttpMessage<string>> Register(string register_user)
              => await TryCatchResponseAsync(async () =>
              {
                  return await Task.Run(() =>
                  {
                      return CreateResponseOk("OK");
                  });
              });
    }
}
