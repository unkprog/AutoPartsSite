using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class AddressInfo : BaseModel
    {
        /// <summary>
        /// FirstName
        /// </summary>
        [DataMember]
        public string FirstName { get; set; }
        /// <summary>
        /// LastName
        /// </summary>
        [DataMember]
        public string LastName { get; set; }
        /// <summary>
        /// LastName
        /// </summary>
        [DataMember]
        public Country Country { get; set; }
        /// <summary>
        /// City
        /// </summary>
        [DataMember]
        public string City { get; set; }
        /// <summary>
        /// ZipCode
        /// </summary>
        [DataMember]
        public string ZipCode { get; set; }
        /// <summary>
        /// Street
        /// </summary>
        [DataMember]
        public string Street { get; set; }
        /// <summary>
        /// PhoneExt
        /// </summary>
        [DataMember]
        public string PhoneExt { get; set; }
        /// <summary>
        /// Phone
        /// </summary>
        [DataMember]
        public string Phone { get; set; }
    }

    public class DeliveryAddressInfo : AddressInfo
    {
    }

    public class BillingAddressInfo : AddressInfo
    {
    }
}
