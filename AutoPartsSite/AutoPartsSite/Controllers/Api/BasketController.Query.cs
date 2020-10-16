using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using System.Data.SqlClient;
using System;
using AutoPartsSite.Models.Basket;
using AutoPartsSite.Models.GlobalParts;

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

        private int AddToBasket(AddToBasketModel model)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[add]", new SqlParameter[] 
                { 
                    new SqlParameter() { ParameterName = "@Uid", Value = model.uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = model.id },
                    new SqlParameter() { ParameterName = "@Quantity", Value = 1 },
                    new SqlParameter() { ParameterName = "@Price", Value = 0 },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = 0 }
                });
            });
            return result;
        }

        private BasketData GetBasketData(string uid)
        {
            BasketData result = new BasketData();
            ExecQuery((query) =>
            {
                query.Execute(@"[add]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                }
                , (values) =>
                {
                    result.Positions.Add(new BasketGoods()
                    {
                        Goods = new Goods() { Id = (int)values[0] },
                        Quantity = (decimal)values[1],
                        Price = (decimal)values[2]
                    });
                });
            });
            FillBasketData(result);
            return result;
        }


        private void FillBasketData(BasketData data)
        {
            //AppSettings.Query.GlobalParts.Execute(@"Search\[get_in]", new SqlParameter[]
            //    {
            //        new SqlParameter() { ParameterName = "@Uid", Value = uid },
            //    }
            //    , (values) =>
            //    {
            //        result.Positions.Add(new BasketGoods()
            //        {
            //            Goods = new Goods() { Id = (int)values[0] },
            //            Quantity = (decimal)values[1],
            //            Price = (decimal)values[2]
            //        });
            //    });
            ////AppSettings.Query.GlobalParts.ExecuteQuery()
            ////     func?.Invoke(query);
        }

    }
}
