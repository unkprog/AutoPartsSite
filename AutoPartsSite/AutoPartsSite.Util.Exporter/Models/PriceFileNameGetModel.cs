namespace AutoPartsSite.Util.Exporter.Models
{
    public class PriceFileNameGetModel
    {
        public string PriceFileName { get; set; } = string.Empty;
        public string PriceFileNameWithoutExtension { get; set; } = string.Empty;
        public string PriceFileExtension { get; set; } = string.Empty;
        public int CustomerAgreementID { get; set; }
        public int DeliveryTariffID { get; set; }
        public int BrandID { get; set; }
        public bool AllOriginal { get; set; }
        public bool AllAnalogue { get; set; }
        public bool TariffSeparateFile { get; set; }
        public bool OneBrandOneFile { get; set; }
        public bool AnaloguesSeparateFile { get; set; }
        public bool NonGenuine { get; set; }
    }
}
