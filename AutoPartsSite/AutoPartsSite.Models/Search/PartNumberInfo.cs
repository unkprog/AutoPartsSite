using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models.Search
{
    /// <summary>
    /// Информация по серийному номеру
    /// </summary>
    [DataContract]
    public class PartNumberInfo : BaseDbModel
    {
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
    }
}
