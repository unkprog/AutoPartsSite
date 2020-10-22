﻿using System;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class New : Page
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
