using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.GlobalParts;
using System;
using System.Linq;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Extensions;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        internal static int SetUserUid(string uid, int userId = 0)
        {
            int result = 0;
            AppSettings.Query.Basket.Execute(@"[set_user_uid]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Uid", string.IsNullOrEmpty(uid) ? (object)DBNull.Value : uid),
                    new SqlParameter("@User", userId)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result = Convert.ToInt32(values[0]);
                });
            return result;
        }

        [NonAction]
        internal static UserUid GetUserUid(string uid)
        {
            UserUid result = new UserUid();
            AppSettings.Query.Basket.Execute(@"[get_user_uid]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Uid", string.IsNullOrEmpty(uid) ? (object)DBNull.Value : uid),
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Id = values[0].ToInt();
                    result.Uid = values[1].ToStr();
                    result.User = values[2].ToInt();
                });
            return result;
        }

        [NonAction]
        internal static List<Country> GetCountries(int langId, int countryId = 0, string code = null)
        {
            List<Country> result = new List<Country>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_countries]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId),
                    new SqlParameter("@CountryID", countryId == 0 ? (object)DBNull.Value : countryId),
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Country() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr() });
                });
            return result;
        }

        [NonAction]
        internal static List<Lang> GetLanguages(int langId, int languageId, string code = null)
        {
            List<Lang> result = new List<Lang>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId == 0 ? (object)DBNull.Value : langId),
                    new SqlParameter("@LanguageID", languageId == 0 ? (object)DBNull.Value : languageId),
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Lang() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr().Trim() });
                });
            return result;
        }

        //[NonAction]
        //internal static Lang GetLanguage(int languageId = 0, string langCode = "")
        //{
        //    List<LangFull> result = new List<LangFull>();
        //    AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]"
        //        , sqlParameters: new SqlParameter[]
        //        {
        //            new SqlParameter("@LanguageId", languageId == 0 ? (object)DBNull.Value : languageId),
        //            new SqlParameter("@Code", string.IsNullOrEmpty(langCode) ?  (object)DBNull.Value : langCode)
        //        }
        //        , onExecute: null
        //        , action: (values) =>
        //        {
        //            result.Add(new LangFull() { Id = (int)values[0], Code = ((string)values[1]).Trim(), Name = (string)values[2], NameRu = (string)values[3] });
        //        });
        //    return result.FirstOrDefault(l => l.Id == languageId);
        //}

        [NonAction]
        internal List<Currency> GetCurrencies(int langId, int currencyId = 0, string code = null)
        {
            List<Currency> result = new List<Currency>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_currencies]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId == 0 ? (object)DBNull.Value : langId),
                    new SqlParameter("@CurrencyID", currencyId == 0 ? (object)DBNull.Value : currencyId),
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Currency() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr(), Symbol = values[4].ToStr(), ShowLeft = values[5].ToBool() });
                });
            return result;
        }
    }
}
