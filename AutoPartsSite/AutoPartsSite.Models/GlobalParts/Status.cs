using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.Models.GlobalParts
{
    [DataContract]
    public class Status : ReferenceNamedDbModel
    {
    }

    [DataContract]
    public class StatusType : ReferenceNamedDbModel
    {
    }

    [DataContract]
    public class StatusInfo
    {
        /// <summary>
        /// Статус
        /// </summary>
        [DataMember]
        public Status Status { get; set; }

        /// <summary>
        /// Статус тип
        /// </summary>
        [DataMember]
        public StatusType StatusType { get; set; }
    }
}
