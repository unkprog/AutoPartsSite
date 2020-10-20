using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models.News
{
    [DataContract]
    public class New : BaseDbModel
    {
        /// <summary>
        /// Заголовок новости
        /// </summary>
        [DataMember]
        public string Header { get; set; }

        /// <summary>
        /// Заголовок новости
        /// </summary>
        [DataMember]
        public DateTime ReleaseDate { get; set; }

        /// <summary>
        /// Содержимое новости
        /// </summary>
        [DataMember]
        public string Content { get; set; }

    }
}
