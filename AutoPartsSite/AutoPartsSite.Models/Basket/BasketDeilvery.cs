using AutoPartsSite.Models.GlobalParts;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{
    [DataContract]
    public class BaseBasketAddressData
    {
     
        [DataMember]
        public List<Country> Countries { get; set; }
    }

    [DataContract]
    public class BasketDeilveryAddressData : BaseBasketAddressData
    {
        [DataMember]
        public AddressInfo DeliveryAddress { get; set; }
    }

    [DataContract]
    public class BasketBillingAddressData : BaseBasketAddressData
    {
        [DataMember]
        public AddressInfo BillingAddress { get; set; }
    }

    [DataContract]
    public class BasketBaseAddress
    {
        [DataMember]
        public BasketQuery qs { get; set; }

    }

    [DataContract]
    public class BasketDeilveryAddress: BasketBaseAddress
    {
        [DataMember]
        public AddressInfo DeliveryAddress { get; set; }
        
    }

    [DataContract]
    public class BasketBillingAddress : BasketBaseAddress
    {
        [DataMember]
        public AddressInfo BillingAddress { get; set; }

    }
}
