using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class PartNumberQuery
    {
        [DataMember]
        public string partNumber { get; set; }
        [DataMember]
        public int siteId { get; set; }
        [DataMember]
        public int countryId { get; set; }
        [DataMember]
        public int languageId { get; set; }
        [DataMember]
        public int currencyId { get; set; }
        [DataMember]
        public int pageRows { get; set; }
        [DataMember]
        public int page { get; set; }
    }
}
