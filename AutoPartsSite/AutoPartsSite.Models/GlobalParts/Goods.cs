using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    /// <summary>
    /// Информация по детали
    /// </summary>
    [DataContract]
    public class Goods : BaseDbModel
    {
        /// <summary>
        /// Артикул
        /// </summary>
        [DataMember]
        public string Articul { get; set; }
        /// <summary>
        /// Номер детали
        /// </summary>
        [DataMember]
        public string PartNumber { get; set; }
        /// <summary>
        /// Наименование детали
        /// </summary>
        [DataMember]
        public string Name { get; set; }
        /// <summary>
        /// Фото детали
        /// </summary>
        [DataMember]
        public string Image { get; set; }
        /// <summary>
        /// Бренд
        /// </summary>
        [DataMember]
        public Brand Brand { get; set; }
        /// <summary>
        /// Страна назначения
        /// </summary>
        [DataMember]
        public Country Country { get; set; }
        /// <summary>
        /// Валюта
        /// </summary>
        [DataMember]
        public Currency Currency { get; set; }
        /// <summary>
        /// Цена
        /// </summary>
        [DataMember]
        public decimal Price { get; set; }
        /// <summary>
        /// Остаток
        /// </summary>
        [DataMember]
        public decimal StockQty { get; set; }
        /// <summary>
        /// дней доставка
        /// </summary>
        [DataMember]
        public int ShipInDays { get; set; }
        /// <summary>
        /// Параметры товара
        /// </summary>
        [DataMember]
        public GoodsParameters Parameters { get; set; }

        /// <summary>
        /// Параметры доставки
        /// </summary>
        [DataMember]
        public DeliveryInfo DefaultDelivery { get; set; }
        /// <summary>
        /// Параметры доставки
        /// </summary>
        [DataMember]
        public List<DeliveryInfo> Deliveries { get; set; }

    }

    [DataContract]
    public class GoodsBasketInfo : Goods 
    {
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
        /// Цена OldCartPrice
        /// </summary>
        [DataMember]
        public decimal CartAmountRaw { get; set; }

        /// <summary>
        /// Скидка
        /// </summary>
        [DataMember]
        public decimal CartDiscountsAmount { get; set; }
    }

    public class GoodsParameters
    {
        [DataMember]
        public decimal WeightPhysical { get; set; }
        [DataMember]
        public decimal WeightVolumetric { get; set; }
        [DataMember]
        public decimal VolumetricDivider { get; set; }
        [DataMember]
        public decimal LengthCm { get; set; }
        [DataMember]
        public decimal WidthCm { get; set; }
        [DataMember]
        public decimal HeightCm { get; set; }
        [DataMember]
        public bool BlockWeightChange { get; set; }
    }


    [DataContract]
    public class GoodsSearch : BaseDbModel
    {
        /// <summary>
        /// Номер детали
        /// </summary>
        [DataMember]
        public string PartNumber { get; set; }
        /// <summary>
        /// Бренд
        /// </summary>
        [DataMember]
        public string Brand { get; set; }
        [DataMember]
        public long Page { get; set; }
        [DataMember]
        public long MaxPage { get; set; }
        [DataMember]
        public decimal Quantity { get; set; }
    }

    [DataContract]
    public class GoodsSubTypeSearchResult
    {
        [DataMember]
        public int Id { get; set; }
        [DataMember]
        public string Descr { get; set; } = "";
        [DataMember]
        public List<Goods> Goods { get; set; } = new List<Goods>();
    }

    [DataContract]
    public class GoodsSearchResult
    {
        /// <summary>
        /// Результат поиска
        /// </summary>
        [DataMember]
        public List<GoodsSubTypeSearchResult> Result { get; set; }
      
        [DataMember]
        public long Page { get; set; }
        [DataMember]
        public long MaxPage { get; set; }
    }
}