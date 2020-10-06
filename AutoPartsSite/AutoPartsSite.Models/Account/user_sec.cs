using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{
    /// <summary>
    /// Пароль
    /// </summary>
    public class user_sec : base_db_model
    {
        /// <summary>
        /// E-mail
        /// </summary>
        [DataMember]
        public string pass { get; set; }
    }
}
