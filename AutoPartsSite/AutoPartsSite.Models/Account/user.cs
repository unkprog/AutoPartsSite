using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{
    public class RegisterUser
    {
        public string Email { get; set; }
    }

    public class LoginUser : RegisterUser
    {
        public string Pass { get; set; }
    }


    /// <summary>
    /// Пользователь
    /// </summary>
    public class User : SysDbModel
    {
        /// <summary>
        /// E-mail
        /// </summary>
        [DataMember]
        public string Email { get; set; }
    }
}
