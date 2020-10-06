using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{

    /// <summary>
    /// Роль пользователя
    /// </summary>
    public class user_role : base_db_model
    {
        /// <summary>
        /// Пользователь
        /// </summary>
        [DataMember]
        public int user { get; set; }

        /// <summary>
        /// Роль
        /// </summary>
        [DataMember]
        public int role { get; set; }
    }
}
