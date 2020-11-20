using AutoPartsSite.Models.GlobalParts;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{

    [DataContract]
    public class BasketGoods : BaseModel
    {
        public BasketGoods()
        {
            Goods = new Goods();
        }
        /// <summary>
        /// Товар
        /// </summary>
        [DataMember]
        public Goods Goods { get; set; }

        /// <summary>
        /// Количество
        /// </summary>
        [DataMember]
        public decimal Quantity { get; set; }

        /// <summary>
        /// Цена
        /// </summary>
        [DataMember]
        public decimal Price { get; set; }
    }

    [DataContract]
    public class BasketData : BaseModel
    {
        public BasketData()
        {
            Positions = new List<BasketGoods>();
            Deliveries = new List<DeliveryInfo>();
        }
        /// <summary>
        /// Позиции корзины
        /// </summary>
        [DataMember]
        public List<BasketGoods> Positions { get; set; }

        /// <summary>
        /// Варианты доставки
        /// </summary>
        [DataMember]
        public List<DeliveryInfo> Deliveries { get; set; }

        /// <summary>
        /// Итоговое количество
        /// </summary>
        [DataMember]
        public decimal TotalQuantity { get; set; }

        /// <summary>
        /// Итоговая сумма
        /// </summary>
        [DataMember]
        public decimal TotalSum { get; set; }

        /// <summary>
        /// Символ валюты
        /// </summary>
        [DataMember]
        public string CurrencySymbol { get; set; }

        /// <summary>
        ///  Символ валюты слева
        /// </summary>
        [DataMember]
        public bool CurrencySymbolShowLeft { get; set; }
    }
}
