using System.Collections.Generic;
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

    public class UserWithRole : User
    {
        /// <summary>
        /// E-mail
        /// </summary>
        [DataMember]
        public List<User_Role> Roles { get; set; }
    }

}
