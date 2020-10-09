﻿using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models
{
    [DataContract]
    public class BaseModel
    {
    }

    public class BaseDbModel : BaseModel
    {
        /// <summary>
        /// Идентификатор записи
        /// </summary>
        [DataMember]
        public int Id { get; set; }
    }

    public class SysDbModel : BaseDbModel
    {
        /// <summary>
        /// Если запись удалена, то значение равно id
        /// </summary>
        [DataMember]
        public int D { get; set; }
        /// <summary>
        /// Время создания
        /// </summary>
        [DataMember]
        public DateTime Cd { get;set;}
        /// <summary>
        /// Кто создал
        /// </summary>
        [DataMember]
        public int Cu { get;set;}
        /// <summary>
        /// Время обновления
        /// </summary>
        [DataMember]
        public DateTime Ud { get; set; }
        /// <summary>
        /// Кто обновил
        /// </summary>
        [DataMember]
        public int Uu { get; set; }
    }

    public class ReferenceDbModel : BaseDbModel
    {
        /// <summary>
        /// Идентификатор записи
        /// </summary>
        [DataMember]
        public string Code { get; set; }
    }

    public class ReferenceNamedDbModel : ReferenceDbModel
    {
        /// <summary>
        /// Идентификатор записи
        /// </summary>
        [DataMember]
        public string Name { get; set; }
    }
}
