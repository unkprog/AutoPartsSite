using System.Runtime.Serialization;

namespace AutoPartsSite.Models.Account
{
    /// <summary>
    /// Пароль
    /// </summary>
    public class User_Sec : BaseDbModel
    {
        /// <summary>
        /// E-mail
        /// </summary>
        [DataMember]
        public string Pass { get; set; }
    }
}
