using AutoPartsSite.Core.Http;
using AutoPartsSite.Core.Models.Security;
using AutoPartsSite.Models;
using AutoPartsSite.Models.Account;
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

                bool isAdmin = false;
                if (userId > 0)
                {
                    UserWithRole user = principal.User as UserWithRole;
                    isAdmin = user != null && user.Roles != null && user.Roles.Count > 0 && user.Roles.FirstOrDefault(f => f.Role == 1) != null;
                }

                List<AskQuestion> result = GetAskQuestions(email, isAdmin ? -1 : userId);
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
                List<AskQuestion> result = GetAskQuestionInfo(userId == 0 ? -1 : q.askQuestionId, userId);
                return CreateResponseOk(result);
            });
        });

        [HttpPost]
        [Route("askquestion")]
        public async Task<HttpMessage<string>> AskQuestion(AskQuestion q)
          => await TryCatchResponseAsync(async () =>
          {
              return await Task.Run(() =>
              {
                  return SearchController.StaticAskQuestion(q);
              });
          });
    }
}
