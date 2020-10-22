using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class Page : BaseDbModel
    {
        /// <summary>
        /// Содержимое
        /// </summary>
        [DataMember]
        public string Content { get; set; }

    }
}
