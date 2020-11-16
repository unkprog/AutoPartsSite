using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{
    [DataContract]
    public class BasketQuery : QueryWithSettings
    {
        [DataMember]
        public int uid { get; set; }
    }
}
