using AutoPartsSite.Models.GlobalParts;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{
    [DataContract]
    public class BasketDeilveryAddressData
    {
        [DataMember]
        public DeliveryAddressInfo DeliveryAddress { get; set; }
        [DataMember]
        public List<Country> Countries { get; set; }
    }

    [DataContract]
    public class BasketDeilveryAddress
    {
        [DataMember]
        public DeliveryAddressInfo DeliveryAddress { get; set; }
        [DataMember]
        public BasketQuery qs { get; set; }
        
    }
}
