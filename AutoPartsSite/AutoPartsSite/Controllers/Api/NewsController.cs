using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.News;
using System;

namespace AutoPartsSite.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/news")]
    public partial class NewsController : QueryController<NewsController>
    {
        public NewsController(ILogger<NewsController> logger) : base(logger)
        {
        }

        [HttpGet]
        public async Task<HttpMessage<List<New>>> News()
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  List<New> result = new List<New>();
                  for (int i = 1; i < 101; i++)
                      result.Add(new New() { Id = i, ReleaseDate = DateTime.Now.AddDays(-1), Header = "Auto parts site news #" + i, Content = "" });

                  return CreateResponseOk(result);
              });
          });
    }
}
