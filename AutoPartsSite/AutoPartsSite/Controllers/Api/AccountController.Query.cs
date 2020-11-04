using AutoPartsSite.Models.GlobalParts;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        internal List<Country> GetCountries(string lang)
        {
            List<Country> result = new List<Country>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_countries]", sqlParameters: null  
                , action: (values) =>
                {
                    result.Add(new Country() { Id = (int)values[0], Code = (string)values[1], Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }

        [NonAction]
        internal List<Lang> GetLanguages(string lang)
        {
            List<Lang> result = new List<Lang>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]", sqlParameters: null
                , action: (values) =>
                {
                    result.Add(new Lang() { Id = (int)values[0], Code = (string)values[1], Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }

        [NonAction]
        internal List<Currency> GetCurrencies(string lang)
        {
            List<Currency> result = new List<Currency>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_currencies]", sqlParameters: null
                , action: (values) =>
                {
                    result.Add(new Currency() { Id = (int)values[0], Code = (string)values[1], Name = lang == "ru" ? (string)values[3] : (string)values[2] });
                });
            return result;
        }
    }
}
