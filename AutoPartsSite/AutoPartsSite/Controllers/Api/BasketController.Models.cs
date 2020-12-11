using AutoPartsSite.Models;

namespace AutoPartsSite.Controllers.Api
{
    public partial class BasketController
    {
        public class PartBasketModel : QueryWithSettings
        {
            public int id { get; set; }
            public decimal qty { get; set; }
        }
    }
}
