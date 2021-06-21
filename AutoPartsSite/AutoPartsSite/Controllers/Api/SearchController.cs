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
                   //List<Brand> result = new List<Brand>();
                   //result.AddRange(new Brand[]
                   //{
                   //    new Brand() { Code = "BMW", Logo = "/img/autobrands/bmw.png" },
                   //    new Brand() { Code = "Chevrolet", Logo = "/img/autobrands/chevrolet.png" },
                   //    new Brand() { Code = "Honda", Logo = "/img/autobrands/honda.png" },
                   //    new Brand() { Code = "Hyundai", Logo = "/img/autobrands/hyundai.png" },
                   //    new Brand() { Code = "Infiniti", Logo = "/img/autobrands/infiniti.png" },
                   //    new Brand() { Code = "Isuzu", Logo = "/img/autobrands/isuzu.png" },
                   //    new Brand() { Code = "Kia", Logo = "/img/autobrands/kia.png" },
                   //    new Brand() { Code = "Land-Rover", Logo = "/img/autobrands/land-rover.png" },
                   //    new Brand() { Code = "Lexus", Logo = "/img/autobrands/lexus.png" },
                   //    new Brand() { Code = "Mazda", Logo = "/img/autobrands/mazda.png" },
                   //    new Brand() { Code = "Mercedes", Logo = "/img/autobrands/mercedes-benz.png" },
                   //    new Brand() { Code = "Mitsubishi", Logo = "/img/autobrands/mitsubishi.png" },
                   //    new Brand() { Code = "Nissan", Logo = "/img/autobrands/nissan.png" },
                   //    new Brand() { Code = "Peugeot", Logo = "/img/autobrands/peugeot.png" },
                   //    new Brand() { Code = "Porsche", Logo = "/img/autobrands/porsche.png" }
                   // });
                   List<Brand> result = GetSearchBrands();
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
                    Principal principal = Core.Http.HttpContext.Current.User as Principal;
                    int userId = principal == null || principal.User == null ? 0 : principal.User.Id;

                    GoodsResult goodsResult = GetGoods(resultSearch, userId, pq, true);
                    GoodsSearchResult result = new GoodsSearchResult()
                    {
                        //Result = goodsResult.Result.Values.ToList(),
                        //ResultSub = goodsResult.ResultSubs.Values.ToList(),
                        Result = new List<GoodsSubTypeSearchResult>(),
                        Page = resultSearch.Count > 0 ? resultSearch[0].Page : 0,
                        MaxPage = resultSearch.Count > 0 ? resultSearch[0].MaxPage : 0
                    };

                    foreach (var sti in goodsResult.Result.Values)
                        result.Result.Add(new GoodsSubTypeSearchResult() { Id = sti.Id, Descr = sti.Descr, Goods = sti.Goods.Values.ToList() });

                    foreach (var sti in result.Result)
                    {
                        foreach (var ritem in sti.Goods)
                        {
                            ritem.Deliveries.Sort((x, y) => x.DeliveryAmount.CompareTo(y.DeliveryAmount));
                            ritem.DefaultDelivery = ritem.Deliveries.Count > 0 ? ritem.Deliveries[0] : new DeliveryInfo();
                        }
                    }

                    //foreach (var ritem in result.ResultSub)
                    //{
                    //    ritem.Deliveries.Sort((x, y) => x.DeliveryAmount.CompareTo(y.DeliveryAmount));
                    //    ritem.DefaultDelivery = ritem.Deliveries.Count > 0 ? ritem.Deliveries[0] : new DeliveryInfo();
                    //}
                    return CreateResponseOk(result);
                });
            });

        [HttpPost]
        [Route("askquestion")]
        public async Task<HttpMessage<string>> AskQuestion(AskQuestion q)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  string result = "Ok";

                  string body = string.Empty;
                  if (!string.IsNullOrEmpty(q.Name))
                      body = string.Concat(body, string.IsNullOrEmpty(body) ? string.Empty : System.Environment.NewLine, "Name: ", q.Name);
                  body = string.Concat(body, string.IsNullOrEmpty(body) ? string.Empty : System.Environment.NewLine, "Email: ", q.Email);
                  body = string.Concat(body, string.IsNullOrEmpty(body) ? string.Empty : System.Environment.NewLine, "Question: ", q.Question);
                  Core.Net.EMail.SendEMail(AppSettings.Smtp.Host, AppSettings.Smtp.Port, AppSettings.Smtp.EnableSsl, AppSettings.Mail.Address, AppSettings.Mail.Password, AppSettings.MailAskQuestions.Address, "Ask question", body);

                  return CreateResponseOk(result);
              });
          });
    }
}
