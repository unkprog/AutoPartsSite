using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using System.Collections.Generic;
using AutoPartsSite.Models.GlobalParts;

namespace AutoPartsSite.Controllers.Api
{

    [AllowAnonymous]
    [Route("api/basket")]
    public partial class BasketController : QueryController<BasketController>
    {
        public BasketController(ILogger<BasketController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("count")]
        public async Task<HttpMessage<int>> Count(string uid)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   int result = GetCount(uid);
                   return CreateResponseOk(result);
               });
           });


        public class AddData
        {
            public string uid { get; set; }
            public int id { get; set; }
        }
        [HttpPost]
        [Route("add")]
        public async Task<HttpMessage<int>> Add(AddData model)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   AddToBasket(model.uid, model.id);
                   int result = GetCount(model.uid);
                   return CreateResponseOk(result);
               });
           });
    }
}
