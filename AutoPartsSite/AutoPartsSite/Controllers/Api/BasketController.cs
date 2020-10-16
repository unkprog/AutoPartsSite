using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Basket;

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


        [HttpPost]
        [Route("add")]
        public async Task<HttpMessage<int>> Add(AddToBasketModel model)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   AddToBasket(model);
                   int result = GetCount(model.uid);
                   return CreateResponseOk(result);
               });
           });


        [HttpGet]
        [Route("view")]
        public async Task<HttpMessage<BasketData>> View(string uid)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   BasketData result = GetBasketData(uid);
                   return CreateResponseOk(result);
               });
           });
    }
}
