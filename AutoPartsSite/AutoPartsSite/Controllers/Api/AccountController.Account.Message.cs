using AutoPartsSite.Core.Http;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Models;
using AutoPartsSite.Models.GlobalParts;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [HttpGet]
        [Route("askquestions")]
        public async Task<HttpMessage<List<AskQuestion>>> AskQuestions(AskQuestion q)
        => await TryCatchResponseAsync(async () =>
        {
            return await Task.Run(() =>
            {
                Principal principal = Core.Http.HttpContext.Current.User as Principal;
                string email = principal == null || principal.User == null ? string.Empty : principal.User.Email;
                int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                List<AskQuestion> result = GetAskQuestions(email, userId);
                return CreateResponseOk(result);
            });
        });

        [HttpPost]
        [Route("askquestioninfo")]
        public async Task<HttpMessage<List<AskQuestion>>> AskQuestionInfo(QueryWithSettings q)
        => await TryCatchResponseAsync(async () =>
        {
            return await Task.Run(() =>
            {
                Principal principal = Core.Http.HttpContext.Current.User as Principal;
                int userId = principal == null || principal.User == null ? 0 : principal.User.Id;
                List<AskQuestion> result = GetAskQuestionInfo(userId == 0 ? -1 : q.askQuestionId);
                return CreateResponseOk(result);
            });
        });
    }
}
