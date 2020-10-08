using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Brand : BaseDbModel
    {
        /// <summary>
        /// Наименование бренда
        /// </summary>
        [DataMember]
        public string Name { get; set; }
        /// <summary>
        /// Логотип бренда
        /// </summary>
        [DataMember]
        public string Logo { get; set; }
    }
}
