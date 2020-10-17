﻿using AutoPartsSite.Models.GlobalParts;
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

        }
        /// <summary>
        /// Идентификатор пользователя
        /// </summary>
        [DataMember]
        public List<BasketGoods> Positions { get; set; }

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
    }
}