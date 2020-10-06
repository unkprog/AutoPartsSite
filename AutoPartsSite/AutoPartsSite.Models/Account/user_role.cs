using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{

    /// <summary>
    /// Роль пользователя
    /// </summary>
    public class User_Role : BaseDbModel
    {
        /// <summary>
        /// Пользователь
        /// </summary>
        [DataMember]
        public int User { get; set; }

        /// <summary>
        /// Роль
        /// </summary>
        [DataMember]
        public int Role { get; set; }
    }
}
