using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Brand : ReferenceDbModel
    {
        /// <summary>
        /// Логотип бренда
        /// </summary>
        [DataMember]
        public string Logo { get; set; }
    }
}
