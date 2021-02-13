using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Currency : ReferenceNamedDbModel
    {
        [DataMember]
        public string Symbol { get; set; }
        [DataMember]
        public bool ShowLeft { get; set; }
    }
}
