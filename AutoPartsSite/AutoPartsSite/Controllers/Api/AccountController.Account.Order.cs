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
                  return CreateResponseOk(GetOrders(userId, qs));
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
                  return CreateResponseOk(new OrderInfo());// GetOrders(userId, qs));
              });
          });

    }
}
