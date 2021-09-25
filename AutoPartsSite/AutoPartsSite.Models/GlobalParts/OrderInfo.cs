using System;
using System.Collections.Generic;
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
        /// <summary>
        /// Позиции заказа
        /// </summary>
        [DataMember]
        public List<OrderInfoItem> Items { get; set; }
        /// <summary>
        /// Платежный адрес
        /// </summary>
        [DataMember]
        public AddressInfo BillingAddress { get; set; }
        /// <summary>
        /// Адрес доставки
        /// </summary>
        [DataMember]
        public AddressInfo DeliveryAddress { get; set; }
    }

    [DataContract]
    public class OrderInfoItem : GoodsOrderItemInfo
    {
        /// <summary>
        /// 
        /// </summary>
        [DataMember]
        public int OrderItemID { get; set; }
    }

}
