using AutoPartsSite.Core.Formatters;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Handlers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Primitives;
using Utf8Json.Resolvers;

namespace AutoPartsSite
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Environment { get; private set; }
        public IServiceCollection Services { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Services = services;

            services.AddControllers().AddMvcOptions(option =>
            {
                option.OutputFormatters.Clear();
                option.OutputFormatters.Add(new Utf8JsonOutputFormatter(StandardResolver.Default));
                option.InputFormatters.Clear();
                option.InputFormatters.Add(new Utf8JsonInputFormatter());
            });
            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });
            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            StaticHttpContextExtensions.AddHttpContextAccessor(services);

            
           // services.AddHttpContextAccessor();
           // // Or you can also register as follows
           // services.TryAddSingleton<IHttpContextAccessor, HttpContextAccess>();
           ////services.AddHttpContextAccessor();
           // //services.AddTransient<IHttpContextAccessor, HttpContext>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            Environment = env;

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticHttpContext1();
            app.UseHttpsRedirection();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseApiAuth();
            //app.Use(async (context, next) =>
            //{
            //    var h = context.Request.Headers;
            //    var authorization = h["Authorization"];
            //    await next();
            //});

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.Use(async (context, next) =>
            {

                if (context.Request.Headers.ContainsKey("Authorization"))
                {
                    StringValues auth = context.Request.Headers["Authorization"];
                    // Initialization.   
                    //AuthenticationHeaderValue authorization = context.Request.Headers.Authorization;
                    //// Verification.   
                    //if (authorization != null && authorization.Scheme == API_KEY_HEADER && !string.IsNullOrEmpty(authorization.Parameter))
                    //{
                    //    Principal principal = AuthUserManager.GetLogIn(authorization.Parameter);
                    //    if (principal != null)
                    //    {
                    //        SetPrincipal(principal);
                    //    }
                    //}
                }
                //var cultureQuery = context.Request.Query["culture"];
                //if (!string.IsNullOrWhiteSpace(cultureQuery))
                //{
                //    var culture = new CultureInfo(cultureQuery);

                //    CultureInfo.CurrentCulture = culture;
                //    CultureInfo.CurrentUICulture = culture;
                //}

                // Call the next delegate/middleware in the pipeline
                await next();
            });
            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Auto parts site" + System.Environment.NewLine + AppSettings.PhysicalApplicationPath);
            });
        }
    }
}
