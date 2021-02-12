using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Payment : ReferenceNamedDbModel
    {
        /// <summary>
        /// Логотип оплаты
        /// </summary>
        [DataMember]
        public string Logo { get; set; }
    }
}
