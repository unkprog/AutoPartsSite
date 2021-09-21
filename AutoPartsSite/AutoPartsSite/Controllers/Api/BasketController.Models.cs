using AutoPartsSite.Models;

namespace AutoPartsSite.Controllers.Api
{
    public partial class BasketController
    {
        public class BasketItemsModel
        {
            public int Id { get; set; }
            public string Uid { get; set; }
            public int RowNumber { get; set; }
            public int GoodsID { get; set; }
            public decimal Qty { get; set; }
            public string Brand { get; set; }
            public string Articul { get; set; }
            public string Descr { get; set; }
            public decimal WeightPhysical { get; set; }
            public decimal WeightVolumetric { get; set; }
            public decimal VolumetricDivider { get; set; }
            public decimal PromoCouponRate { get; set; }
            public decimal VatRate { get; set; }
            public decimal OrderPriceRaw { get; set; }
            public decimal OrderAmountRaw { get; set; }
            public decimal OrderDiscounts { get; set; }
            public decimal OrderDiscountsAmount { get; set; }
            public decimal OrderPrice { get; set; }
            public decimal OrderAmount { get; set; }
            public decimal OrderDeliveryAmount { get; set; }
            public decimal OrderTotalAmount { get; set; }
            public decimal OrderVatAmount { get; set; }
            public decimal OrderVatTotalAmount { get; set; }
            public decimal CartPriceRaw { get; set; }
            public decimal CartAmountRaw { get; set; }
            public decimal CartDiscounts { get; set; }
            public decimal CartDiscountsAmount { get; set; }
            public decimal CartPrice { get; set; }
            public decimal CartAmount { get; set; }
            public decimal CartDeliveryAmount { get; set; }
            public decimal CartTotalAmount { get; set; }
            public decimal CartVatAmount { get; set; }
            public decimal CartVatTotalAmount { get; set; }
            public string Comment { get; set; }

            public int DeliveryRouteID { get; set; }
            public int DeliveryTariffID { get; set; }
            public int OrderCurrencyID { get; set; }
            public decimal OrderCurrencyRate { get; set; }
            public int CartCurrencyID { get; set; }
            public decimal CartCurrencyRate { get; set; }
            public int InvoiceCurrencyID { get; set; }
            public decimal InvoiceCurrencyRate { get; set; }
            public int AccountingCurrencyID { get; set; }
        }
    }
}
