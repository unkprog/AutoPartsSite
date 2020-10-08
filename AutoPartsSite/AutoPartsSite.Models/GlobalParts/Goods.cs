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
    }
}
