using System.Runtime.Serialization;

namespace AutoPartsSite.Core.Cef
{
    [DataContract]
    public class CommandData
    {
        [DataMember]
        public string Url { get; set; }

        [DataMember]
        public string Html { get; set; }

    }
}
