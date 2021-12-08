﻿using AutoPartsSite.Core.Http;
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
                  List<Order> orders = GetOrders(userId, 0, qs);

                  StatusInfo si = null;
                  foreach (var o in orders)
                  {
                      if (o.Status == null || o.Status.Id < 1)
                      {
                          if (si == null)
                              si = GetOrderStatus(qs.languageId, "Order.Header.New");
                          o.Status = si.Status;
                          o.StatusType = si.StatusType;
                      }
                  }
                  return CreateResponseOk(orders);
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
                  if (result.Order.Status == null || result.Order.Status.Id < 1)
                  {
                      StatusInfo si = GetOrderStatus(qs.languageId, "Order.Header.New");
                      result.Order.Status = si.Status;
                      result.Order.StatusType = si.StatusType;
                  }

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
