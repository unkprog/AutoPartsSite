using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using System.Collections.Generic;
using AutoPartsSite.Models.GlobalParts;
using AutoPartsSite.Core.Models.Security;
using System.Linq;

namespace AutoPartsSite.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/search")]
    public partial class SearchController : QueryController<SearchController>
    {
        public SearchController(ILogger<SearchController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("listBrands")]
        public async Task<HttpMessage<List<Brand>>> ListBrands()
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   List<Brand> result = new List<Brand>();
                   result.AddRange(new Brand[]
                   {
                       new Brand() { Code = "BMW", Logo = "/img/autobrands/bmw.png" },
                       new Brand() { Code = "Chevrolet", Logo = "/img/autobrands/chevrolet.png" },
                       new Brand() { Code = "Honda", Logo = "/img/autobrands/honda.png" },
                       new Brand() { Code = "Hyundai", Logo = "/img/autobrands/hyundai.png" },
                       new Brand() { Code = "Infiniti", Logo = "/img/autobrands/infiniti.png" },
                       new Brand() { Code = "Isuzu", Logo = "/img/autobrands/isuzu.png" },
                       new Brand() { Code = "Kia", Logo = "/img/autobrands/kia.png" },
                       new Brand() { Code = "Land-Rover", Logo = "/img/autobrands/land-rover.png" },
                       new Brand() { Code = "Lexus", Logo = "/img/autobrands/lexus.png" },
                       new Brand() { Code = "Mazda", Logo = "/img/autobrands/mazda.png" },
                       new Brand() { Code = "Mercedes", Logo = "/img/autobrands/mercedes-benz.png" },
                       new Brand() { Code = "Mitsubishi", Logo = "/img/autobrands/mitsubishi.png" },
                       new Brand() { Code = "Nissan", Logo = "/img/autobrands/nissan.png" },
                       new Brand() { Code = "Peugeot", Logo = "/img/autobrands/peugeot.png" },
                       new Brand() { Code = "Porsche", Logo = "/img/autobrands/porsche.png" }
                    });
                   return CreateResponseOk(result);
               });
           });

        [HttpPost]
        [Route("partNumber")]
        public async Task<HttpMessage<GoodsSearchResult>> PartNumber(PartNumberQuery pq)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    List<GoodsSearch> resultSearch = GetSearchGoods(pq.partNumber, pq.pageRows, pq.page);
                //Principal principal = Core.Http.HttpContext.Current.User as Principal;
                //bool isGuest = principal == null || principal.User == null || principal.User.Id  == 0 ? true : false;

                GoodsResult goodsResult = GetGoods(resultSearch, pq, true);
                    GoodsSearchResult result = new GoodsSearchResult()
                    {
                        Result = goodsResult.Result.Values.ToList(),
                        ResultSub = goodsResult.ResultSubs.Values.ToList(),
                        Page = resultSearch.Count > 0 ? resultSearch[0].Page : 0,
                        MaxPage = resultSearch.Count > 0 ? resultSearch[0].MaxPage : 0
                    };

                    foreach(var ritem in result.Result)
                    {
                        ritem.Deliveries.Sort((x, y) => x.DeliveryAmount.CompareTo(y.DeliveryAmount));
                        ritem.DefaultDelivery = ritem.Deliveries.Count > 0 ? ritem.Deliveries[0] : new DeliveryInfo();
                    }
                    foreach (var ritem in result.ResultSub)
                    {
                        ritem.Deliveries.Sort((x, y) => x.DeliveryAmount.CompareTo(y.DeliveryAmount));
                        ritem.DefaultDelivery = ritem.Deliveries.Count > 0 ? ritem.Deliveries[0] : new DeliveryInfo();
                    }
                    return CreateResponseOk(result);
                });
            });


    }
}
