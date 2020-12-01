using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{
    [DataContract]
    public class BasketDeilvery : BaseDbModel
    {
        [DataMember]
        public string FirstName { get; set; }
        [DataMember]
        public string LastName { get; set; }
        [DataMember]
        public int CountryID { get; set; }
        [DataMember]
        public string City { get; set; }
        [DataMember]
        public string Zipcode { get; set; }
        [DataMember]
        public string Street { get; set; }
        [DataMember]
        public string Phone { get; set; }
    }
}
