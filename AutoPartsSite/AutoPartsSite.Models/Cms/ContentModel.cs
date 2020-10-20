using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Cms
{
    [DataContract]
    public class ContentModel : BaseDbModel
    {
        /// <summary>
        /// Содержимое
        /// </summary>
        [DataMember]
        public string Content { get; set; }

    }
}
