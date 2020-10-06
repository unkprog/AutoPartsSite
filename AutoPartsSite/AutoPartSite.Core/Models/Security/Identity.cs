using System.Security.Principal;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Core.Models.Security
{
    public class Identity : IIdentity
    {
        public Identity(User user)
        {
            User = user;
        }

        public User User { get; private set; }

    #region IIdentity
        public string Name => User == null ? string.Empty : User.Email;

        public string AuthenticationType => "Password";

        public bool IsAuthenticated => User != null;
    #endregion
    }
}
