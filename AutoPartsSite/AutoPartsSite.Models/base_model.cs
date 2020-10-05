using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models
{
    [DataContract]
    public class base_model
    {
    }


    public class base_db_model : base_model
    {
        /// <summary>
        /// Идентификатор записи
        /// </summary>
        [DataMember]
        public int id { get; set; }
    }

    public class sys_db_model : base_db_model
    {
        /// <summary>
        /// Если запись удалена, то значение равно id
        /// </summary>
        [DataMember]
        public int d { get; set; }
        /// <summary>
        /// Время создания
        /// </summary>
        [DataMember]
        public DateTime cd { get;set;}
        /// <summary>
        /// Кто создал
        /// </summary>
        [DataMember]
        public int cu { get;set;}
        /// <summary>
        /// Время обновления
        /// </summary>
        [DataMember]
        public DateTime ud { get; set; }
        /// <summary>
        /// Кто обновил
        /// </summary>
        [DataMember]
        public int uu { get; set; }
    }
}
