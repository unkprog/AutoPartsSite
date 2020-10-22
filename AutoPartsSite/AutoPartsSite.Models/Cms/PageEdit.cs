using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class PageEdit : BaseDbModel
    {
        /// <summary>
        /// Страница
        /// </summary>
        [DataMember]
        public string Page { get; set; }

        /// <summary>
        /// Содержимое En
        /// </summary>
        [DataMember]
        public string ContentEn { get; set; }
        /// <summary>
        /// Содержимое Ru
        /// </summary>
        [DataMember]
        public string ContentRu { get; set; }

    }
}
