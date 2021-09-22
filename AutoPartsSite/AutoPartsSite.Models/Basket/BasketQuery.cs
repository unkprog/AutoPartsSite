using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{
    [DataContract]
    public class BasketQuery : QueryWithSettings
    {
        [DataMember]
        public int id { get; set; }
        [DataMember]
        public int qty { get; set; }
        [DataMember]
        public string promoCode { get; set; }
        [DataMember]
        public int deliveryTariffID { get; set; }
        [DataMember]
        public int deliveryRouteID { get; set; }
    }
}
