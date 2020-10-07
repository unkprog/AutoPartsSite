using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models.Search
{
    [DataContract]
    public class BrandInfo : BaseDbModel
    {
        /// <summary>
        /// Наименование бренда
        /// </summary>
        [DataMember]
        public string Name { get; set; }
        /// <summary>
        /// Логотип бренда
        /// </summary>
        [DataMember]
        public string Logo { get; set; }
    }
}
