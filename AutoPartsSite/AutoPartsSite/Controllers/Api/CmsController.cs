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
        public async Task<HttpMessage<PageEdit>> EditPage(string page)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  PageEdit result = GetPageEdit(page);
                  //if(result == null)
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
                  SetPageEditContent(page);
                  return CreateResponseOk(true);
              });
          });


        [HttpGet]
        [Route("page")]
        public async Task<HttpMessage<Page>> Page(string lang, string page)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  PageEdit pageEdit = GetPageEdit(page);
                  pageEdit = GetPageEditContent(pageEdit);
                  Page result = new Page() { Content = lang == "ru" ? pageEdit.ContentRu : pageEdit.ContentEn };
                  return CreateResponseOk(result);
              });
          });
    }
}
