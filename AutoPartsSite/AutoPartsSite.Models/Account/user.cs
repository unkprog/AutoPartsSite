using System.Collections.Generic;
using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{
    [DataContract]
    public class RegisterUser
    {
        public string Email { get; set; }
    }

    [DataContract]
    public class LoginUser : RegisterUser
    {
        public string Pass { get; set; }
        public string Uid { get; set; }
    }

    [DataContract]
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

    [DataContract]
    public class UserWithRole : User
    {
        /// <summary>
        /// E-mail
        /// </summary>
        [DataMember]
        public List<User_Role> Roles { get; set; }
    }

}
