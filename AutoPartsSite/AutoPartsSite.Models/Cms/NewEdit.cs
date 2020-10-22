using System;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class NewEdit : PageEdit
    {
        /// <summary>
        /// Заголовок новости En
        /// </summary>
        [DataMember]
        public string HeaderEn { get; set; }
        /// <summary>
        /// Заголовок новости Ru
        /// </summary>
        [DataMember]
        public string HeaderRu { get; set; }
        /// <summary>
        /// Дата публикации новости
        /// </summary>
        [DataMember]
        public DateTime ReleaseDate { get; set; }
    }
}
