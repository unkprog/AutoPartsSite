using System.Runtime.Serialization;

namespace AutoPartsSite.Models
{
    public class register_user
    {
        public string email { get; set; }
    }

    public class login_user : register_user
    {
        public string pass { get; set; }
    }


    /// <summary>
    /// Пользователь
    /// </summary>
    public class user : sys_db_model
    {
        /// <summary>
        /// E-mail
        /// </summary>
        [DataMember]
        public string email { get; set; }
    }

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
