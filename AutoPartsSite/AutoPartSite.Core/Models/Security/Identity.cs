using System.Security.Principal;

namespace AutoPartSite.Core.Models.Security
{
    public class Identity : IIdentity
    {
        public Identity(UserModel user)
        {
            User = user;
        }

        public UserModel User { get; private set; }

    #region IIdentity
        public string Name => User == null ? string.Empty : User.Email;

        public string AuthenticationType => "Password";

        public bool IsAuthenticated => User != null;
    #endregion
    }
}
