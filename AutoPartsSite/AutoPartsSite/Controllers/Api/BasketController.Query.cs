using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using System.Data.SqlClient;
using System;

namespace AutoPartsSite.Controllers.Api
{
    public partial class BasketController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return new Query(AppSettings.Database.AutoPartsSite.Basket.Connection.ConnectionString, AppSettings.Database.AutoPartsSite.Basket.Path.Query);
        }

        [NonAction]
        private int GetCount(string uid)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"[count]", new SqlParameter[] { new SqlParameter() { ParameterName = "@Uid", Value = uid } }
                , (values) =>
                {
                    result = Convert.ToInt32(values[0]);
                });
            });
            return result;
        }

        private int AddToBasket(string uid, int id)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[add]", new SqlParameter[] 
                { 
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = id },
                    new SqlParameter() { ParameterName = "@Quantity", Value = 1 },
                    new SqlParameter() { ParameterName = "@Price", Value = 0 },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = 0 }
                });
            });
            return result;
        }
    }
}
