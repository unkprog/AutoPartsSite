using AutoPartsSite.Models.GlobalParts;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{
    [DataContract]
    public class BasketDeilvery : DeliveryAddressInfo
    {
        public DeliveryAddressInfo Delivery { get; set; }

        public List<Country> Countries { get; set; }
    }
}
