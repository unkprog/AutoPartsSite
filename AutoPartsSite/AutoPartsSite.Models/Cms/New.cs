using System;
using System.Runtime.Serialization;
using Utf8Json;
using Utf8Json.Formatters;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class New : Page
    {
        public New() { }

        public New(string lang, NewEdit newEdit)
        {
            Id = newEdit.Id;
            ReleaseDate = newEdit.ReleaseDate;
            Header = (lang == "ru" ? newEdit.HeaderRu : newEdit.HeaderEn);
            Content = (lang == "ru" ? newEdit.ContentRu : newEdit.ContentEn);
        }

        /// <summary>
        /// Заголовок новости
        /// </summary>
        [DataMember]
        public string Header { get; set; }

        /// <summary>
        /// Дата публикации новости
        /// </summary>
        [DataMember]
        [JsonFormatter(typeof(DateTimeFormatter), "dd.MM.yyyy")]
        public DateTime ReleaseDate { get; set; }
    }
}
