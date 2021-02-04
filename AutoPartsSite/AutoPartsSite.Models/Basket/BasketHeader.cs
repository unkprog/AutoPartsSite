namespace AutoPartsSite.Models.Basket
{
    public class BasketDataHeader : BaseDbModel
    {
        public string Uid { get; set; }
        public int DeliveryRouteID { get; set; }
        public int DeliveryTariffID { get; set; }
        public int DeliveryAddressID { get; set; }
        public int BillingAddressID { get; set; }
        public string Comment { get; set; }
        public int OrderCurrencyID { get; set; }
        public decimal OrderCurrencyRate { get; set; }
        public int CartCurrencyID { get; set; }
        public decimal CartCurrencyRate { get; set; }
        public int InvoiceCurrencyID { get; set; }
        public decimal InvoiceCurrencyRate { get; set; }
        public int AccountingCurrencyID { get; set; }
        public string PromoCode { get; set; }
    }
}
