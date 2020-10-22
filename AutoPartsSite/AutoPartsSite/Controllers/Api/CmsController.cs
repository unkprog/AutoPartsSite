using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Cms;

namespace AutoPartsSite.Controllers.Api
{
    [Route("api/cms")]
    public partial class CmsController : QueryController<CmsController>
    {
        public CmsController(ILogger<CmsController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("editpage")]
        public async Task<HttpMessage<PageEdit>> PageEdit(string page)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  PageEdit result = GetPageEdit(page);
                  result = GetPageEditContent(result);
                  return CreateResponseOk(result);
              });
          });

        [HttpPost]
        [Route("editpage")]
        public async Task<HttpMessage<bool>> PageEditPost(PageEdit page)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                 // PageEdit result = GetPageEdit(page);
                  return CreateResponseOk(true);
              });
          });
    }
}
