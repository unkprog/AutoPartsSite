using System.Linq;
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
                  int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                  
                   BasketData result = GetBasketData(pq.uid);
                   pq.promoCode = result.Header.PromoCode = GetBaskePromoCode(pq.uid);
                   List<GoodsSearch> goodsSearch = GetBasketGoods(result.Positions);
                   FillBasketData(result, goodsSearch, userId, pq);

                   if (result.Positions.Count == 0)
                       DeleteHeaderBasket(pq);
                   else if (result.Header.DeliveryTariffID == 0 && result.Deliveries.Count > 0)
                   {
                       result.Header.DeliveryTariffID = result.Deliveries[0].Id;
                       SetBaskeDeliveryTariffID(pq.uid, result.Header.DeliveryTariffID);
                   }


                   if (!string.IsNullOrEmpty(result.Header.PromoCode))
                       if (!(GetCouponId(result.Header.PromoCode) > 0))
                       {
                           result.Header.PromoCode = string.Empty;
                           SetBaskePromoCode(pq.uid, string.Empty);
                       }

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

                   //Lang lang = AccountController.GetLanguages(qs.languageId).FirstOrDefault();
                   result.Countries = AccountController.GetCountries(qs.languageId);

                   int deliveryId = GetBasketDelivery(qs.uid);
                   Principal principal = Core.Http.HttpContext.Current.User as Principal;
                   int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                   List<AddressInfo> addresses = GetAddress(userId, qs, 3);

                   result.DeliveryAddress = (deliveryId == 0 ? addresses.FirstOrDefault(f => f.Default) : addresses.FirstOrDefault(f => f.Id == deliveryId));

                   if (result.DeliveryAddress == null)
                       result.DeliveryAddress = new AddressInfo();

                   return CreateResponseOk(result);
               });
           });

        [HttpPost]
        [Route("setdeliveryaddressdata")]
        public async Task<HttpMessage<int>> SetDelivery(BasketDeilveryAddress delivery)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Principal principal = Core.Http.HttpContext.Current.User as Principal;

                  int deliveryId = SetDeliveryAddress(3, delivery, principal.User.Email);
                  delivery.DeliveryAddress.Id = deliveryId;
                  SetBasketDelivery(delivery.qs.uid, deliveryId);
                  return CreateResponseOk(deliveryId);
              });
          });

        [HttpPost]
        [Route("billingaddressdata")]
        public async Task<HttpMessage<BasketBillingAddressData>> BillingData(QueryWithSettings qs)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  BasketBillingAddressData result = new BasketBillingAddressData() { Countries = new List<Country>() };

                  //Lang lang = AccountController.GetLanguages(qs.languageId).FirstOrDefault();
                  result.Countries = AccountController.GetCountries(qs.languageId);


                  int billingId = GetBasketBilling(qs.uid);

                  Principal principal = Core.Http.HttpContext.Current.User as Principal;
                  int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                  List<AddressInfo> addresses = GetAddress(userId, qs, 3);

                  result.BillingAddress = (billingId == 0 ? addresses.FirstOrDefault(f => f.Default) : addresses.FirstOrDefault(f => f.Id == billingId));

                  if (result.BillingAddress == null)
                  {
                      billingId = GetBasketDelivery(qs.uid);
                      addresses = GetAddress(userId, qs, 3);
                      result.BillingAddress = (billingId == 0 ? addresses.FirstOrDefault(f => f.Default) : addresses.FirstOrDefault(f => f.Id == billingId));
                      if (result.BillingAddress == null)
                          result.BillingAddress = new AddressInfo();
                      else
                          result.BillingAddress.Id = 0;
                  }

                  return CreateResponseOk(result);
              });
          });

        [HttpPost]
        [Route("setbillingaddressdata")]
        public async Task<HttpMessage<int>> SetBilling(BasketBillingAddress billing)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Principal principal = Core.Http.HttpContext.Current.User as Principal;

                  int billingId = SetBillingAddress(4, billing, principal.User.Email);
                  billing.BillingAddress.Id = billingId;
                  SetBasketBilling(billing.qs.uid, billingId);
                  return CreateResponseOk(billingId);
              });
          });

        [HttpPost]
        [Route("paymentlist")]
        public async Task<HttpMessage<List<Payment>>> PaymentList(QueryWithSettings qs)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  List<Payment> result = GetPaymentList(qs);
                  foreach(Payment p in result)
                  {
                           if (p.Code.ToUpper() == "CARD"  ) p.Logo = "/img/payments/flat/default.svg";
                      else if (p.Code.ToUpper() == "PAYPAL") p.Logo = "/img/payments/flat/paypal.svg";
                  }
                  return CreateResponseOk(result);
              });
          });
    }
}
