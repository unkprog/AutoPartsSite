using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Cms;

namespace AutoPartsSite.Controllers.Api
{
    [Route("api/news")]
    public partial class NewsController : QueryController<NewsController>
    {
        public NewsController(ILogger<NewsController> logger) : base(logger)
        {
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("news")]
        public async Task<HttpMessage<List<New>>> News(string lang, int pageRows, int page)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  List<NewEdit> news = CmsController.GetNews(this, pageRows, page);
                  List<New> result = new List<New>(news.Count);
                  for (int i = 0, icount = news.Count; i < icount; i++)
                  {
                      result.Add(new New(lang, news[i]));
                  }
                   return CreateResponseOk(result);
              });
          });

        [HttpGet]
        [AllowAnonymous]
        [Route("new")]
        public async Task<HttpMessage<New>> New(string lang, int id)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  NewEdit newEdit = CmsController.GetNewEdit(this, id);
                  newEdit = CmsController.GetEditContent(this, @"New\[get_content]", newEdit);
                  New result = new New() { Content = lang == "ru" ? newEdit.ContentRu : newEdit.ContentEn };
                  return CreateResponseOk(result);
              });
          });
    }
}
