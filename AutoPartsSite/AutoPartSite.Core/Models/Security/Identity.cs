using System.Security.Principal;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Core.Models.Security
{
    public class Identity : IIdentity
    {
        public Identity(user user)
        {
            User = user;
        }

        public user User { get; private set; }

    #region IIdentity
        public string Name => User == null ? string.Empty : User.email;

        public string AuthenticationType => "Password";

        public bool IsAuthenticated => User != null;
    #endregion
    }
}
