using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Managers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System.Threading;
using System.Threading.Tasks;

namespace AutoPartsSite.Handlers
{
    public class AuthorizationMiddleware
    {
        private static readonly string API_KEY_HEADER = "APS-ApiKey";

        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public AuthorizationMiddleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            _next = next;
            _logger = loggerFactory.CreateLogger<AuthorizationMiddleware>();
        }

        public async Task Invoke(HttpContext context)
        {
            StringValues authorization = context.Request.Headers["Authorization"];
            if(authorization.Count > 0)
            {
                foreach(var item in authorization)
                {
                    if (!string.IsNullOrEmpty(item))
                    {
                        string[] v = item.Split(' ');
                        string key = "";
                        string val = "";
                        if (v.Length > 0) key = v[0];
                        if (v.Length > 1) val = v[1];
                        if (key == API_KEY_HEADER && !string.IsNullOrEmpty(val))
                        {
                            Principal principal = AuthUserManager.GetLogIn(val);
                            if (principal != null)
                                SetPrincipal(principal);
                        }
                    }
                }
            }
            
            await _next.Invoke(context);
        }

        public static void SetPrincipal(Principal principal)
        {
            // setting.   
            Thread.CurrentPrincipal = principal;
            // Verification.   

            if (Core.Http.HttpContext.Current != null)
            {
                // Setting.   
                Core.Http.HttpContext.Current.User = principal;
            }
        }
    }

    public static class AuthorizationMiddlewareExtension
    {
        public static IApplicationBuilder UseApiAuthorization(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<AuthorizationMiddleware>();
        }
    }
}
