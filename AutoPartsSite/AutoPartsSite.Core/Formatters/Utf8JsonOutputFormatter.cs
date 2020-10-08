using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Formatters;
using Utf8Json;

namespace AutoPartsSite.Core.Formatters
{
    public class Utf8JsonOutputFormatter : IOutputFormatter //, IApiResponseTypeMetadataProvider
    {
        const string ContentType = "application/json";
        //static readonly string[] SupportedContentTypes = new[] { ContentType };

        readonly IJsonFormatterResolver resolver;

        public Utf8JsonOutputFormatter() : this(null)
        {

        }
        public Utf8JsonOutputFormatter(IJsonFormatterResolver resolver)
        {
            this.resolver = resolver ?? JsonSerializer.DefaultResolver;
        }

        public bool CanWriteResult(OutputFormatterCanWriteContext context)
        {
            return true;
        }

        public Task WriteAsync(OutputFormatterWriteContext context)
        {
            context.HttpContext.Response.ContentType = ContentType;

            if (context.ObjectType == typeof(object))
                return JsonSerializer.NonGeneric.SerializeAsync(context.HttpContext.Response.Body, context.Object, resolver);
            else
                return JsonSerializer.NonGeneric.SerializeAsync(context.ObjectType, context.HttpContext.Response.Body, context.Object, resolver);
        }
    }
}
