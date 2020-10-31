using System;
using System.Runtime.Serialization;
using Utf8Json;
using Utf8Json.Formatters;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class NewEdit : PageEdit
    {
        /// <summary>
        /// Заголовок новости En
        /// </summary>
        [DataMember]
        public string HeaderEn { get; set; } = string.Empty;
        /// <summary>
        /// Заголовок новости Ru
        /// </summary>
        [DataMember]
        public string HeaderRu { get; set; } = string.Empty;
        /// <summary>
        /// Дата публикации новости
        /// </summary>
        [DataMember]
        [JsonFormatter(typeof(DateTimeFormatter), "dd.MM.yyyy")]
        public DateTime ReleaseDate { get; set; } = DateTime.Today;
    }
}
