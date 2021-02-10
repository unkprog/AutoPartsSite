﻿using System.Linq;
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
using AutoPartsSite.Models;

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
        public async Task<HttpMessage<int>> Add(BasketQuery pq)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   UpdatePartBasket(pq, true);
                   int result = GetCount(pq.uid);
                   return CreateResponseOk(result);
               });
           });


        [HttpPost]
        [Route("update")]
        public async Task<HttpMessage<BasketData>> Update(BasketQuery pq)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   decimal result = UpdatePartBasket(pq);
                   return View(pq);
               });
           });

        [HttpPost]
        [Route("delete")]
        public async Task<HttpMessage<BasketData>> Delete(BasketQuery pq)
        => await TryCatchResponseAsync(async () =>
        {
            return await Task.Run(() =>
            {
                DeletePartBasket(pq);
                int result = GetCount(pq.uid);
                return View(pq);
            });
        });

        [HttpPost]
        [Route("view")]
        public async Task<HttpMessage<BasketData>> View(BasketQuery pq)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   Principal principal = Core.Http.HttpContext.Current.User as Principal;
                   bool isGuest = principal == null || principal.User == null || principal.User.Id == 0 ? true : false;
                  
                   BasketData result = GetBasketData(pq.uid);
                   //pq.promoCode = result.PromoCode = GetBaskePromoCode(pq.uid);
                   List<GoodsSearch> goodsSearch = GetBasketGoods(result.Positions);
                   FillBasketData(result, goodsSearch, pq, isGuest);
                   return CreateResponseOk(result);
               });
           });

        [HttpPost]
        [Route("setpromocode")]
        public async Task<HttpMessage<BasketData>> PromoCode(BasketQuery pq)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  SetBaskePromoCode(pq.uid, pq.promoCode);
                  return View(pq);
              });
          });

        [HttpPost]
        [Route("setdeliverytariff")]
        public async Task<HttpMessage<BasketData>> DeliveryTariff(BasketQuery pq)
         => await TryCatchResponseAsync(async () =>
         {
             return await Task.Run(() =>
             {
                 SetBaskeDeliveryTariffID(pq.uid, pq.deliveryTariffID);
                 return View(pq);
             });
         });

        [HttpPost]
        [Route("deliveryaddressdata")]
        public async Task<HttpMessage<BasketDeilveryAddressData>> DeliveryData(QueryWithSettings qs)
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   BasketDeilveryAddressData result = new BasketDeilveryAddressData() { Countries = new List<Country>() };

                   Lang lang = AccountController.GetLanguage(qs.languageId);
                   result.Countries = AccountController.GetCountries(lang?.Code);

                   List<DeliveryAddressInfo> addresses = GetDeliveryAddress(qs, 3);

                   result.DeliveryAddress = addresses.FirstOrDefault(f => f.Default);
                   if (result.DeliveryAddress == null)
                       result.DeliveryAddress = new DeliveryAddressInfo();

                   return CreateResponseOk(result);
               });
           });

        [HttpPost]
        [Route("setdeliverydata")]
        public async Task<HttpMessage<int>> SetDelivery(BasketDeilveryAddress delivery)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Principal principal = Core.Http.HttpContext.Current.User as Principal;
                  
                  int deliveryId = SetDeliveryAddress(3, delivery, principal.User.Email);
                  SetBasketDelivery(delivery.qs.uid, deliveryId);
                  return CreateResponseOk(deliveryId);
              });
          });
    }
}
