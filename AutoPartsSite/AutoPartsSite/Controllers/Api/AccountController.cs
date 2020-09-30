using Microsoft.Extensions.Logging;
using AutoPartsSite.Core.Controllers;

namespace AutoPartsSite.Controllers.Api
{
    public class AccountController : ApiControllerBase<AccountController>
    {
        public AccountController(ILogger<AccountController> logger) : base(logger)
        {
        }

        //[HttpPost]
        //public HttpMessage<IEnumerable<Project>> Get()
        //{
        //    return this.TryCatch<ProjectController, IEnumerable<Project>>(() =>
        //    {
        //        return new ProjectManager().ListProjects();
        //    });
        //}
    }
}
