using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Delivery : ReferenceNamedDbModel
    {
        /// <summary>
        /// Логотип бренда
        /// </summary>
        [DataMember]
        public string Logo { get; set; }
    }

    [DataContract]
    public class DeliveryInfo : Delivery
    {
        /// <summary>
        /// Доставка дней, от
        /// </summary>
        [DataMember]
        public int DaysMin { get; set; }
        /// <summary>
        /// Доставка дней, до
        /// </summary>
        [DataMember]
        public int DaysMax { get; set; }

        /// <summary>
        /// Сумма доставки
        /// </summary>
        [DataMember]
        public decimal Amount { get; set; }
        /// <summary>
        /// Сумма доставки
        /// </summary>
        [DataMember]
        public decimal DeliveryAmount { get; set; }
        /// <summary>
        /// Сумма НДС
        /// </summary>
        [DataMember]
        public decimal VatAmount { get; set; }
        /// <summary>
        /// Сумма Итого
        /// </summary>
        [DataMember]
        public decimal TotalAmount { get; set; }
    }
}
