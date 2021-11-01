using AutoPartsSite.Core.Http;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Models;
using AutoPartsSite.Models.GlobalParts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {


        [HttpPost]
        [Route("addresses")]
        public async Task<HttpMessage<List<AddressInfo>>> Addresses(QueryWithSettings qs)
        => await TryCatchResponseAsync(async () =>
        {
            return await Task.Run(() =>
            {
                Principal principal = Core.Http.HttpContext.Current.User as Principal;
                string email = principal == null || principal.User == null ? string.Empty : principal.User.Email;
                int userId = principal == null || principal.User == null ? 0 : principal.User.Id;

                List<AddressInfo> addresses = GetAddresses(userId, qs, -1, -1);
                List<AddressInfo> result = (addresses.Count > 0 ? addresses.Where(f => f.UserId == userId).ToList() : addresses);
                return CreateResponseOk(result);
            });
        });

    }
}
