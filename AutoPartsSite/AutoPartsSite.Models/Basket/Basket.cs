using AutoPartsSite.Models.GlobalParts;
using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Basket
{

    [DataContract]
    public class BasketGoods : BaseModel
    {
        /// <summary>
        /// Количество
        /// </summary>
        [DataMember]
        public decimal RowNumber { get; set; }

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
        /// Количество
        /// </summary>
        [DataMember]
        public decimal Qty { get; set; }
        /// <summary>
        /// Цена
        /// </summary>
        [DataMember]
        public decimal Price { get; set; }

        /// <summary>
        /// Цена изменилась
        /// </summary>
        [DataMember]
        public bool PriceChanged { get; set; }

        /// <summary>
        /// Количество изменилось
        /// </summary>
        [DataMember]
        public bool QtyChanged { get; set; }

        /// <summary>
        /// Цена CartPriceRaw
        /// </summary>
        [DataMember]
        public decimal CartPriceRaw { get; set; }

        /// <summary>
        /// Цена OldCartPrice
        /// </summary>
        [DataMember]
        public decimal OldCartPrice { get; set; }

        /// <summary>
        /// Предыдущее количество
        /// </summary>
        [DataMember]
        public decimal OldQty { get; set; }

        /// <summary>
        /// Цена CartAmountw
        /// </summary>
        [DataMember]
        public decimal CartAmount { get; set; }
        /// <summary>
        /// Цена CartAmountRaw
        /// </summary>
        [DataMember]
        public decimal CartAmountRaw { get; set; }

        /// <summary>
        /// Скидка
        /// </summary>
        [DataMember]
        public decimal CartDiscountsAmount { get; set; }
    }

    [DataContract]
    public class BasketData : BaseModel
    {
        public BasketData()
        {
            Header = new BasketDataHeader();
            Positions = new List<BasketGoods>();
            Deliveries = new List<DeliveryInfo>();
        }
        /// <summary>
        /// Шапка
        /// </summary>
        [DataMember]
        public BasketDataHeader Header { get; set; }

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
