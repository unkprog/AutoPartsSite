using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class AddressInfo : BaseDbModel
    {
        /// <summary>
        /// FullName
        /// </summary>
        [DataMember]
        public string FullName { get; set; }
        /// <summary>
        /// Company
        /// </summary>
        [DataMember]
        public int CompanyId { get; set; }
        [DataMember]
        public Company Company { get; set; }
        /// <summary>
        /// Country
        /// </summary>
        [DataMember]
        public int CountryId { get; set; }
        [DataMember]
        public Country Country { get; set; }

        /// <summary>
        /// Region
        /// </summary>
        [DataMember]
        public string Region { get; set; }
        
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
        /// PhoneCode
        /// </summary>
        [DataMember]
        public string PhoneCode { get; set; }
        /// <summary>
        /// Phone
        /// </summary>
        [DataMember]
        public string Phone { get; set; }
        /// <summary>
        /// PhoneExt
        /// </summary>
        [DataMember]
        public string PhoneExt { get; set; }

        [DataMember]
        public bool Default { get; set; }
        /// <summary>
        /// Email
        /// </summary>
        [DataMember]
        public string Email { get; set; }

        /// <summary>
        /// AddressTypeId
        /// </summary>
        [DataMember]
        public decimal AddressTypeId { get; set; }
        /// <summary>
        /// UserId
        /// </summary>
        [DataMember]
        public int UserId { get; set; }
    }

   
}
