using System.Security.Claims;
using AutoPartsSite.Models.Account;

namespace AutoPartSite.Core.Models.Security
{
    public class Principal : ClaimsPrincipal
    {
        public Principal(User user) : base(new Identity(user))
        {
            User = user;
            ////Identity = new Identity(user);
            //List<ClaimsIdentity> claims = new List<ClaimsIdentity>();
            //claims.Add(new ClaimsIdentity(new Identity(user)));
            //AddIdentities(claims);
        }

        public User User { get; }

        //public bool IsInRole(string role)
        //{
        //    throw new System.NotImplementedException();
        //}

        public string GetKey()
        {
           // Identity identity = (Identity)Identity;
            string key = string.Concat("id=", User?.Id, ";email=", User?.Email);
            byte[] utf8Bytes = System.Text.Encoding.UTF8.GetBytes(key);
            return System.Convert.ToBase64String(utf8Bytes);
        }
    }
}