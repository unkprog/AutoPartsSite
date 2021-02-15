using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{
    [DataContract]
    public class UserUid : BaseDbModel
    {
        /// <summary>
        /// Uid
        /// </summary>
        [DataMember]
        public string Uid { get; set; }
        /// <summary>
        /// Пользователь
        /// </summary>
        [DataMember]
        public int User { get; set; }

    }
}
