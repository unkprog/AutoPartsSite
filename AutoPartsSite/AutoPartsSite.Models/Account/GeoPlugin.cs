using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{
    [DataContract]
    public class GeoPlugin
    {
        [DataMember(Name = "geoplugin_request")]
        public string Request { get; set; }
        [DataMember(Name = "geoplugin_status")]
        public int Status { get; set; }
        [DataMember(Name = "geoplugin_delay")]
        public string Delay { get; set; }
        [DataMember(Name = "geoplugin_credit")]
        public string Credit { get; set; }
        [DataMember(Name = "geoplugin_city")]
        public string City { get; set; }
        [DataMember(Name = "geoplugin_region")]
        public string Region { get; set; }
        [DataMember(Name = "geoplugin_regionCode")]
        public string RegionCode { get; set; }
        [DataMember(Name = "geoplugin_regionName")]
        public string RegionName { get; set; }
        [DataMember(Name = "geoplugin_areaCode")]
        public string AreaCode { get; set; }
        [DataMember(Name = "geoplugin_dmaCode")]
        public string DmaCode { get; set; }
        [DataMember(Name = "geoplugin_countryCode")]
        public string CountryCode { get; set; }
        [DataMember(Name = "geoplugin_countryName")]
        public string CountryName { get; set; }
        [DataMember(Name = "geoplugin_inEU")]
        public int InEU { get; set; }
        [DataMember(Name = "geoplugin_euVATrate")]
        public bool EuVATrate { get; set; }
        [DataMember(Name = "geoplugin_continentCode")]
        public string ContinentCode { get; set; }
        [DataMember(Name = "geoplugin_continentName")]
        public string ContinentName { get; set; }
        [DataMember(Name = "geoplugin_latitude")]
        public string Latitude { get; set; }
        [DataMember(Name = "geoplugin_longitude")]
        public string Longitude { get; set; }
        [DataMember(Name = "geoplugin_locationAccuracyRadius")]
        public string LocationAccuracyRadius { get; set; }
        [DataMember(Name = "geoplugin_timezone")]
        public string Timezone { get; set; }
        [DataMember(Name = "geoplugin_currencyCode")]
        public string CurrencyCode { get; set; }
        [DataMember(Name = "geoplugin_currencySymbol")]
        public string CurrencySymbol { get; set; }
        [DataMember(Name = "geoplugin_currencySymbol_UTF8")]
        public string CurrencySymbol_UTF8 { get; set; }
        [DataMember(Name = "geoplugin_currencyConverter")]
        public decimal CurrencyConverter { get; set; }
    }
}
