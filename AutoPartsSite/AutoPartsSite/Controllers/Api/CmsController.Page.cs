using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Cms;

namespace AutoPartsSite.Controllers.Api
{
    public partial class CmsController
    {
        [HttpGet]
        [Route("editpage")]
        public async Task<HttpMessage<PageEdit>> EditPage(string page)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  PageEdit result = GetPageEdit(page);
                  //if(result == null)
                  result = GetEditContent(this, @"Page\[get_content]", result);
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
                  SetEditContent(@"Page\[get_content]", @"Page\[set_content]", @"Page\[del_content]", page);
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
                  pageEdit = GetEditContent(this, @"Page\[get_content]", pageEdit);
                  Page result = new Page() { Content = lang == "ru" ? pageEdit.ContentRu : pageEdit.ContentEn };
                  return CreateResponseOk(result);
              });
          });
    }
}
