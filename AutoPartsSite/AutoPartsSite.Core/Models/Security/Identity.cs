﻿using System.Runtime.Serialization;
using System.Security.Principal;
using AutoPartsSite.Models.Account;

namespace AutoPartsSite.Core.Models.Security
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

    [DataContract]
    public class IdentityResult
    {
        [DataMember]
        public bool Auth { get; set; }
        [DataMember]
        public bool Cms { get; set; }
        [DataMember]
        public string Token { get; set; }
        [DataMember]
        public User User { get; set; }
        [DataMember]
        public int  SiteUserId { get; set; }
    }

    [DataContract]
    public class VersionResult
    {
        [DataMember]
        public string Version { get; set; }

    }

    [DataContract]
    public class UidResult : VersionResult
    {
        [DataMember]
        public IdentityResult Identity { get; set; }
        
    }
}
