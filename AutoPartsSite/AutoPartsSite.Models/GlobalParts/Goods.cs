using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.GlobalParts
{
    /// <summary>
    /// Информация по серийному номеру
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
        /// Бренд
        /// </summary>
        [DataMember]
        public Country Country { get; set; }
        /// <summary>
        /// Бренд
        /// </summary>
        [DataMember]
        public GoodsParameters Parameters { get; set; }
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
    }


    [DataContract]
    public class GoodsSearchResult
    {
        /// <summary>
        /// Результат поиска
        /// </summary>
        [DataMember]
        public List<Goods> Result { get; set; }
        [DataMember]
        public long Page { get; set; }
        [DataMember]
        public long MaxPage { get; set; }
    }
}