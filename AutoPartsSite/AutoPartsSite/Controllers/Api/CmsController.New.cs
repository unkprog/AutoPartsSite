using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Http;
using AutoPartsSite.Models.Cms;

namespace AutoPartsSite.Controllers.Api
{
    public partial class CmsController
    {
        [HttpGet]
        [Route("cardnews")]
        public async Task<HttpMessage<List<NewEdit>>> CardNews()
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    List<NewEdit> result = GetCardNews();
                    return CreateResponseOk(result);
                });
            });

        [HttpGet]
        [Route("editnew")]
        public async Task<HttpMessage<NewEdit>> EditNew(int id)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    NewEdit result = GetNewEdit(this, id);
                    result = GetEditContent(this, @"New\[get_content]", result);
                    return CreateResponseOk(result);
                });
            });

        [HttpPost]
        [Route("editnew")]
        public async Task<HttpMessage<bool>> NewPost(NewEdit page)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    NewEdit result = SetNewEdit(page);
                    SetEditContent(@"New\[get_content]", @"New\[set_content]", @"New\[del_content]", result);
                    return CreateResponseOk(true);
                });
            });

        [HttpGet]
        [Route("delnew")]
        public async Task<HttpMessage<bool>> NewDel(int id)
            => await TryCatchResponseAsync(async () =>
            {
                return await Task.Run(() =>
                {
                    DeleteNew(id);
                    return CreateResponseOk(true);
                });
            });

    }
}
