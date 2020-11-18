using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Delivery : ReferenceNamedDbModel
    {

    }

    [DataContract]
    public class DeliveryInfo : Delivery
    {
        /// <summary>
        /// Доставка дней, от
        /// </summary>
        [DataMember]
        public int DeliveryDaysMin { get; set; }
        /// <summary>
        /// Доставка дней, до
        /// </summary>
        [DataMember]
        public int DeliveryDaysMax { get; set; }
    }
}
