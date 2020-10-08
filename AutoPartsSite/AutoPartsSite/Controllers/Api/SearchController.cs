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
                       new Brand() { Name = "BMW", Logo = "/img/autobrands/bmw.png" },
                       new Brand() { Name = "Chevrolet", Logo = "/img/autobrands/chevrolet.png" },
                       new Brand() { Name = "Honda", Logo = "/img/autobrands/honda.png" },
                       new Brand() { Name = "Hyundai", Logo = "/img/autobrands/hyundai.png" },
                       new Brand() { Name = "Infiniti", Logo = "/img/autobrands/infiniti.png" },
                       new Brand() { Name = "Isuzu", Logo = "/img/autobrands/isuzu.png" },
                       new Brand() { Name = "Kia", Logo = "/img/autobrands/kia.png" },
                       new Brand() { Name = "Land-Rover", Logo = "/img/autobrands/land-rover.png" },
                       new Brand() { Name = "Lexus", Logo = "/img/autobrands/lexus.png" },
                       new Brand() { Name = "Mazda", Logo = "/img/autobrands/mazda.png" },
                       new Brand() { Name = "Mercedes", Logo = "/img/autobrands/mercedes-benz.png" },
                       new Brand() { Name = "Mitsubishi", Logo = "/img/autobrands/mitsubishi.png" },
                       new Brand() { Name = "Nissan", Logo = "/img/autobrands/nissan.png" },
                       new Brand() { Name = "Peugeot", Logo = "/img/autobrands/peugeot.png" },
                       new Brand() { Name = "Porsche", Logo = "/img/autobrands/porsche.png" }
                    });
                   return CreateResponseOk(result);
               });
           });

        [HttpGet]
        [Route("partNumber")]
        public async Task<HttpMessage<List<Goods>>> PartNumber(string partNumber)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    List<Goods> result = new List<Goods>();
                    result.AddRange(new Goods[]
                    {
                        new Goods() { Name = "Деталь №1", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №2", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №3", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №4", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №5", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №6", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №7", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №8", PartNumber="0123456789", Image="/img/noimage.png"},
                        new Goods() { Name = "Деталь №9", PartNumber="0123456789", Image="/img/noimage.png"},
                     });
                    return CreateResponseOk(result);
                });
            });
    }
}
