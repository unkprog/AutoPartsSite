using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.GlobalParts;
using System;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        internal List<Country> GetCountries(string lang, string code = null)
        {
            List<Country> result = new List<Country>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_countries]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , action: (values) =>
                {
                    result.Add(new Country() { Id = (int)values[0], Code = (string)values[1], Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }

        [NonAction]
        internal List<Lang> GetLanguages(string lang, string code = null)
        {
            List<Lang> result = new List<Lang>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , action: (values) =>
                {
                    result.Add(new Lang() { Id = (int)values[0], Code = (string)values[1], Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
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
                , action: (values) =>
                {
                    result.Add(new Currency() { Id = (int)values[0], Code = (string)values[1], Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }
    }
}
