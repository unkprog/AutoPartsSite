using AutoPartsSite.Core.Http;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Models;
using AutoPartsSite.Models.GlobalParts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [HttpPost]
        [Route("orders")]
        public async Task<HttpMessage<List<Order>>> Orders(QueryWithSettings qs)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Principal principal = Core.Http.HttpContext.Current.User as Principal;
                  int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                  return CreateResponseOk(GetOrders(userId, 0, qs));
              });
          });

        [HttpPost]
        [Route("orderinfo")]
        public async Task<HttpMessage<OrderInfo>> OrderInfo(QueryWithSettings qs)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  Principal principal = Core.Http.HttpContext.Current.User as Principal;
                  int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                  List<Order> orders = GetOrders(userId, qs.orderId, qs);

                  OrderInfo result = new OrderInfo();
                  result.Order = orders != null && orders.Count > 0 ? orders[0]: new Order();


                  result.Items = OrderItems(qs.orderId, qs);

                  List<AddressInfo> addr = GetAddress(qs.orderId, qs, 3);
                  result.BillingAddress = addr != null && addr.Count > 0 ? addr[0] : new AddressInfo();
                  addr = GetAddress(qs.orderId, qs, 4);
                  result.DeliveryAddress = addr != null && addr.Count > 0 ? addr[0] : new AddressInfo();

                  return CreateResponseOk(result);
              });
          });

    }
}
