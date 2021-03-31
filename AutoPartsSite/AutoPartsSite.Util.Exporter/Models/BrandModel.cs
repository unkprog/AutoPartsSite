namespace AutoPartsSite.Util.Exporter.Models
{
    public class BrandModel
    {
        public int ID { get; set; }
        public string Code { get; set; } = string.Empty;
        public int NonGenuine { get; set; }
        public int DeliveryTariffID { get; set; }
}
}
