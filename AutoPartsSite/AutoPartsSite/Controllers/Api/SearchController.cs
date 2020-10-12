using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using AutoPartsSite.Core.Http;
using System.Collections.Generic;
using AutoPartsSite.Models.GlobalParts;
using System.IO;
using AutoPartsSite.Core.Sql;

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

        [HttpGet]
        [Route("partNumber")]
        public async Task<HttpMessage<List<Goods>>> PartNumber(string partNumber, int pageRows, int page)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    List<Goods> result = GetGoods(partNumber, pageRows, page);
                    return CreateResponseOk(result);
                });
            });


    }
}
