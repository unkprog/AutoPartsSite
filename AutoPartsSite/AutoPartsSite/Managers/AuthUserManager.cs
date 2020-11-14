using System.Collections.Generic;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Handlers;

namespace AutoPartsSite.Managers
{
    public static class AuthUserManager
    {
        private static Dictionary<string, Principal> authorizedList = new Dictionary<string, Principal>();

        public static void LogIn(Principal principal)
        {
            string key = principal.GetKey();
            if (!authorizedList.ContainsKey(key))
                authorizedList.Add(key, principal);
            else
            {
                authorizedList[key] = principal;
            }
            AuthorizationMiddleware.SetPrincipal(principal);
        }

        public static void LogOut(string key)
        {
            if (authorizedList.ContainsKey(key))
                authorizedList.Remove(key);
        }

        public static Principal GetLogIn(string key)
        {
            Principal principal = null;
            if (!authorizedList.TryGetValue(key, out principal))
                principal = null;
            return principal;
        }
    }
}
