using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Formatters;
using Utf8Json;

namespace AutoPartSite.Core.Formatters
{
    public class Utf8JsonInputFormatter : IInputFormatter // , IApiRequestFormatMetadataProvider
    {
        //const string ContentType = "application/json";
        //static readonly string[] SupportedContentTypes = new[] { ContentType };

        readonly IJsonFormatterResolver resolver;

        public Utf8JsonInputFormatter() : this(null)
        {

        }

        public Utf8JsonInputFormatter(IJsonFormatterResolver resolver)
        {
            this.resolver = resolver ?? JsonSerializer.DefaultResolver;
        }

        public bool CanRead(InputFormatterContext context)
        {
            return true;
        }

        public Task<InputFormatterResult> ReadAsync(InputFormatterContext context)
        {
            var request = context.HttpContext.Request;

            var reader = new StreamReader(request.Body);
            var rawMessage = reader.ReadToEnd();
            var result = JsonSerializer.NonGeneric.Deserialize(context.ModelType, rawMessage, resolver);
            return InputFormatterResult.SuccessAsync(result);
        }
    }
}
