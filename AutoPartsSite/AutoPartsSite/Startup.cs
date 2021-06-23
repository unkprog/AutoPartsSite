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
using System.IO;
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

            DefaultFilesOptions options = new DefaultFilesOptions();
            options.DefaultFileNames.Clear();
            options.DefaultFileNames.Add("app/index.html");
            app.UseDefaultFiles(options);
            app.UseStaticFiles();

            //app.UseDefaultFiles();
            //app.UseStaticFiles();

            app.UseApiAuthorization();

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.Run(async (context) =>
            {
                System.Type t = typeof(Startup);
                string file = string.Concat(t.Assembly.Location.Replace(t.Assembly.ManifestModule.Name, string.Empty), @"wwwroot\app\controller", context.Request.Path.ToString().Replace(@"/", @"\"), ".html");
                if (File.Exists(file))
                {
                    file = string.Concat(t.Assembly.Location.Replace(t.Assembly.ManifestModule.Name, string.Empty), @"wwwroot\app\index.html");
                    string html = Core.IO.Helper.ReadFileAsString(file);
                    file = context.Request.Path.ToString();
                    if (file[0] == '/')
                        file = file.Substring(1);
                    html = html.Replace("<!--location-->", "<script>localStorage.setItem('startupPage','" + file + "');</script>");
                    await context.Response.WriteAsync(html);
                }
                else
                    await context.Response.WriteAsync("Auto parts site - page " + context.Request.Path.ToString() + " not found!");
            });
        }
    }
}
