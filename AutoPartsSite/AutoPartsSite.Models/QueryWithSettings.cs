using System.Runtime.Serialization;

namespace AutoPartsSite.Models
{
    [DataContract]
    public class QueryWithSettings
    {
        [DataMember]
        public string uid { get; set; }
        [DataMember]
        public int siteUserId { get; set; }
        [DataMember]
        public int countryId { get; set; }
        [DataMember]
        public int languageId { get; set; }
        [DataMember]
        public int currencyId { get; set; }

    }
}
