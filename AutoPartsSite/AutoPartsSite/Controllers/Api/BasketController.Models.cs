namespace AutoPartsSite.Controllers.Api
{
    public partial class BasketController
    {
        public class PartBasketModel
        {
            public string uid { get; set; }
            public int id { get; set; }
            public decimal qty { get; set; }
        }
    }
}
