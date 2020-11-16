using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class PartNumberQuery : QueryWithSettings
    {
        [DataMember]
        public string partNumber { get; set; }
        [DataMember]
        public int pageRows { get; set; }
        [DataMember]
        public int page { get; set; }
    }
}
