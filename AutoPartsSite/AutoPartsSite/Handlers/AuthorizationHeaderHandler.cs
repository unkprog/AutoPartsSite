using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Managers;

namespace AutoPartsSite.Handlers
{
    public class AuthorizationHeaderHandler : DelegatingHandler
    {
        private static readonly string API_KEY_HEADER = "APS-ApiKey";
        #region Send method.
        /// <summary>   
        /// Send method.   
        /// </summary>   
        /// <param name="request">Request parameter</param>   
        /// <param name="cancellationToken">Cancellation token parameter</param>   
        /// <returns>Return HTTP response.</returns>   
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // Initialization.   
            AuthenticationHeaderValue authorization = request.Headers.Authorization;
            // Verification.   
            if (authorization != null && authorization.Scheme == API_KEY_HEADER && !string.IsNullOrEmpty(authorization.Parameter))
            {
                Principal principal = AuthUserManager.GetLogIn(authorization.Parameter);
                if (principal != null)
                {
                    SetPrincipal(principal);
                }
            }
            // Info.   
            return base.SendAsync(request, cancellationToken);
        }
        #endregion
        #region Set principal method.  
        /// <summary>   
        /// Set principal method.   
        /// </summary>   
        /// <param name="principal">Principal parameter</param>   
        public static void SetPrincipal(Principal principal)
        {
            // setting.   
            Thread.CurrentPrincipal = principal;
            // Verification.   

            if (HttpContext.Current != null)
            {
                // Setting.   
                HttpContext.Current.User = principal;
            }
        }
        #endregion
    }
}
