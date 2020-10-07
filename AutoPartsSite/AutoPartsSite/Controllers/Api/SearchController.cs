using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;
using AutoPartSite.Core.Http;
using System.Collections.Generic;
using AutoPartsSite.Models.Search;

namespace AutoPartsSite.Controllers.Api
{
    [AllowAnonymous]
    [Route("api/search")]
    public class SearchController : ApiControllerBase<SearchController>
    {
        public SearchController(ILogger<SearchController> logger) : base(logger)
        {
        }

        [HttpGet]
        [Route("listBrands")]
        public async Task<HttpMessage<List<BrandInfo>>> ListBrands()
           => await TryCatchResponseAsync(async () =>
           {
               return await Task.Run(() =>
               {
                   List<BrandInfo> result = new List<BrandInfo>();
                   result.AddRange(new BrandInfo[]
                   {
                       new BrandInfo() { Name = "BMW", Logo = "/img/autobrands/bmw.png" },
                       new BrandInfo() { Name = "Chevrolet", Logo = "/img/autobrands/chevrolet.png" },
                       new BrandInfo() { Name = "Honda", Logo = "/img/autobrands/honda.png" },
                       new BrandInfo() { Name = "Hyundai", Logo = "/img/autobrands/hyundai.png" },
                       new BrandInfo() { Name = "Infiniti", Logo = "/img/autobrands/infiniti.png" },
                       new BrandInfo() { Name = "Isuzu", Logo = "/img/autobrands/isuzu.png" },
                       new BrandInfo() { Name = "Kia", Logo = "/img/autobrands/kia.png" },
                       new BrandInfo() { Name = "Land-Rover", Logo = "/img/autobrands/land-rover.png" },
                       new BrandInfo() { Name = "Lexus", Logo = "/img/autobrands/lexus.png" },
                       new BrandInfo() { Name = "Mazda", Logo = "/img/autobrands/mazda.png" },
                       new BrandInfo() { Name = "Mercedes", Logo = "/img/autobrands/mercedes-benz.png" },
                       new BrandInfo() { Name = "Mitsubishi", Logo = "/img/autobrands/mitsubishi.png" },
                       new BrandInfo() { Name = "Nissan", Logo = "/img/autobrands/nissan.png" },
                       new BrandInfo() { Name = "Peugeot", Logo = "/img/autobrands/peugeot.png" },
                       new BrandInfo() { Name = "Porsche", Logo = "/img/autobrands/porsche.png" }
                    });
                   return CreateResponseOk(result);
               });
           });

        [HttpGet]
        [Route("partNumber")]
        public async Task<HttpMessage<List<PartNumberInfo>>> PartNumber(string partNumber)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    List<PartNumberInfo> result = new List<PartNumberInfo>();
                    result.AddRange(new PartNumberInfo[]
                    {
                        new PartNumberInfo() { Name = "Деталь №1", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №2", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №3", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №4", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №5", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №6", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №7", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №8", PartNumber="0123456789", Image="/img/noimage.png"},
                        new PartNumberInfo() { Name = "Деталь №9", PartNumber="0123456789", Image="/img/noimage.png"},
                     });
                    return CreateResponseOk(result);
                });
            });
    }
}
