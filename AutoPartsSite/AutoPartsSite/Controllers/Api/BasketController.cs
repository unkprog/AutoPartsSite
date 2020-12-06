using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Basket;
using AutoPartsSite.Models.GlobalParts;
using AutoPartsSite.Core.Models.Security;
using System.Collections.Generic;

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
        public async Task<HttpMessage<int>> Add(PartBasketModel model)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   UpdatePartBasket(model, true);


                   int result = GetCount(model.uid);
                   return CreateResponseOk(result);
               });
           });


        [HttpPost]
        [Route("update")]
        public async Task<HttpMessage<decimal>> Update(PartBasketModel model)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   decimal result = UpdatePartBasket(model);
                   return CreateResponseOk(result);
               });
           });

        [HttpPost]
        [Route("delete")]
        public async Task<HttpMessage<int>> Delete(PartBasketModel model)
        => await TryCatchResponseAsync(async () =>
        {
            return await Task.Run(() =>
            {
                DeletePartBasket(model);
                int result = GetCount(model.uid);
                return CreateResponseOk(result);
            });
        });

        [HttpPost]
        [Route("view")]
        public async Task<HttpMessage<BasketData>> View(string uid, BasketQuery pq)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   Principal principal = Core.Http.HttpContext.Current.User as Principal;
                   bool isGuest = principal == null || principal.User == null || principal.User.Id == 0 ? true : false;
                  
                   BasketData result = GetBasketData(uid);
                   List<GoodsSearch> goodsSearch = GetBasketGoods(result);
                   FillBasketData(result, goodsSearch, pq, isGuest);
                   return CreateResponseOk(result);
               });
           });


        [HttpGet]
        [Route("deliverydata")]
        public async Task<HttpMessage<List<Country>>> DeliveryData(string lang)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   List<Country> result = AccountController.GetCountries(lang);
                   return CreateResponseOk(result);
               });
           });

        [HttpPost]
        [Route("setdeilvery")]
        public async Task<HttpMessage<int>> SetDelivery(string uid, BasketDeilvery delivery)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  int deliveryId = AddDelivery(delivery);
                  SetBasketDelivery(uid, deliveryId);
                  return CreateResponseOk(deliveryId);
              });
          });
    }
}
