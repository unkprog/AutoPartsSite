using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.GlobalParts;
using System;
using System.Linq;

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
        internal static List<Country> GetCountries(string lang, string code = null)
        {
            List<Country> result = new List<Country>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_countries]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Country() { Id = (int)values[0], Code = ((string)values[1]).Trim(), Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }

        [NonAction]
        internal static List<Lang> GetLanguages(string lang, string code = null)
        {
            List<Lang> result = new List<Lang>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Lang() { Id = (int)values[0], Code = ((string)values[1]).Trim(), Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }

        [NonAction]
        internal static Lang GetLanguage(int languageId)
        {
            List<LangFull> result = new List<LangFull>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LanguageID", languageId)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new LangFull() { Id = (int)values[0], Code = ((string)values[1]).Trim(), Name = (string)values[2], NameRu = (string)values[3] });
                });
            return result.FirstOrDefault(l => l.Id == languageId);
        }

        [NonAction]
        internal List<Currency> GetCurrencies(string lang, string code = null)
        {
            List<Currency> result = new List<Currency>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_currencies]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Currency() { Id = (int)values[0], Code = ((string)values[1]).Trim(), Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }
    }
}
