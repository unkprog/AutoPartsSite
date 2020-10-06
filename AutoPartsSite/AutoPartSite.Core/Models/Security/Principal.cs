using System.Security.Claims;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Core.Models.Security
{
    public class Principal : ClaimsPrincipal
    {
        public Principal(user user) : base(new Identity(user))
        {
            ////Identity = new Identity(user);
            //List<ClaimsIdentity> claims = new List<ClaimsIdentity>();
            //claims.Add(new ClaimsIdentity(new Identity(user)));
            //AddIdentities(claims);
        }

       // public IIdentity Identity { get; private set; }

        //public bool IsInRole(string role)
        //{
        //    throw new System.NotImplementedException();
        //}

        public string GetKey()
        {
            Identity identity = (Identity)Identity;
            string key = string.Concat("id=", identity.User.id, ";email=", identity.User.email);
            byte[] utf8Bytes = System.Text.Encoding.UTF8.GetBytes(key);
            return System.Convert.ToBase64String(utf8Bytes);
        }
    }
}