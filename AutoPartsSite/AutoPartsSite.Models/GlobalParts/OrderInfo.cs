using System;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{

    [DataContract]
    public class OrderInfo : BaseModel
    {
        /// <summary>
        /// Заказ
        /// </summary>
        [DataMember]
        public Order Order { get; set; }

    }
}
