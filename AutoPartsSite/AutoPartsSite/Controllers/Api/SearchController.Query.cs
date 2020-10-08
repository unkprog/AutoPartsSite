using System.IO;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;

namespace AutoPartsSite.Controllers.Api
{
    public partial class SearchController
    {
        private string PhysicalApplicationPath => Directory.GetCurrentDirectory();

        [NonAction]
        protected override Query CreateQuery()
        {
            return new Query(AppSettings.Database.GlobalParts.Connection.ConnectionString, string.Concat(PhysicalApplicationPath, AppSettings.Database.GlobalParts.Path.Query));
        }
    }
}
