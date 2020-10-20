using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class New : ContentModel
    {
        /// <summary>
        /// Заголовок новости
        /// </summary>
        [DataMember]
        public string Header { get; set; }

        /// <summary>
        /// Дата публикации новости
        /// </summary>
        [DataMember]
        public DateTime ReleaseDate { get; set; }
    }
}
