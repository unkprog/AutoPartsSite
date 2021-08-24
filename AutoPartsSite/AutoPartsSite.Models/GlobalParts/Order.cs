using System;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{

    [DataContract]
    public class Order : BaseModel
    {
        /// <summary>
        /// Идентификатор заказа
        /// </summary>
        [DataMember]
        public int OrderHeaderID { get; set; }
        /// <summary>
        /// Номер заказа
        /// </summary>
        [DataMember]
        public string OrderNumberFull { get; set; }
        /// <summary>
        /// Дата заказа
        /// </summary>
        [DataMember]
        public DateTime OrderDate { get; set; }

        /// <summary>
        /// Комментарий
        /// </summary>
        [DataMember]
        public string Comment { get; set; }
    }
}
