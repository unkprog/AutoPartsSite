using System.Runtime.Serialization;
using AutoPartsSite.Models.GlobalParts;

namespace AutoPartsSite.Models.Account
{
    [DataContract]
    public class Settings
    {
        [DataMember]
        public Country Country { get; set; }

        [DataMember]
        public Lang Language { get; set; }

        [DataMember]
        public Currency Currency { get; set; }
    }
}
