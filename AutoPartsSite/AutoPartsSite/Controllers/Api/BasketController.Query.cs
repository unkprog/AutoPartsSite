using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using System.Data.SqlClient;
using System;
using AutoPartsSite.Models.Basket;
using AutoPartsSite.Models.GlobalParts;
using System.Linq;
using System.Collections.Generic;

namespace AutoPartsSite.Controllers.Api
{
    public partial class BasketController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return AppSettings.Query.Basket;
        }

        [NonAction]
        private int GetCount(string uid)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"[count]", new SqlParameter[] { new SqlParameter() { ParameterName = "@Uid", Value = uid } }, onExecute: null
                , (values) =>
                {
                    result = Convert.ToInt32(values[0]);
                });
            });
            return result;
        }

        private decimal UpdatePartBasket(PartBasketModel model, bool isAdd = false)
        {
            decimal result = model.qty;
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(isAdd ? @"[add]" : @"[update]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = model.uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = model.id },
                    new SqlParameter() { ParameterName = "@Quantity", Value = model.qty },
                });
            });
            return result;
        }

        private void DeletePartBasket(PartBasketModel model)
        {
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[del]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = model.uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = model.id },
                });
            });
        }

        private BasketData GetBasketData(string uid)
        {
            BasketData result = new BasketData();
            ExecQuery((query) =>
            {
                query.Execute(@"[get]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                }
                , onExecute: null
                , (values) =>
                {
                    result.Positions.Add(new BasketGoods()
                    {
                        Goods = new Goods() { Id = (int)values[0] },
                        Quantity = (decimal)values[1]
                    });
                });
            });
            FillBasketData(result);
            return result;
        }


        private void FillBasketData(BasketData data)
        {
            if (data?.Positions?.Count == 0)
                return;

            Dictionary<int, Goods> res = new Dictionary<int, Goods>();
            Goods goods;
            int id;
            foreach (var item in data.Positions)
                if(!res.TryGetValue(item.Goods.Id, out goods))
                    res.Add(item.Goods.Id, item.Goods);


            AppSettings.Query.GlobalParts.Execute(@"Search\[get_in]", new SqlParameter[]
            {
                new SqlParameter() { ParameterName = "@GoodsID", Value = res.Keys.ToArray() }
            }
            , onExecute: null
            , (values) =>
            {
                id = (int)values[0];
                if(res.TryGetValue(id, out goods))
                {
                    goods.Articul = (string)values[1];
                    goods.PartNumber = (string)values[2];
                    goods.Name = (string)values[3];
                    goods.Brand = new Brand() { Id = (int)values[5], Code = (string)values[6] };
                    goods.Country = new Country() { Id = (int)values[7], Code = (string)values[8], Name = (string)values[9] };
                    goods.Parameters = new GoodsParameters()
                    {
                        WeightPhysical = (decimal)values[11],
                        WeightVolumetric = (decimal)values[12],
                        VolumetricDivider = (decimal)values[13],
                        LengthCm = (decimal)values[14],
                        WidthCm = (decimal)values[15],
                        HeightCm = (decimal)values[16],
                        BlockWeightChange = (bool)values[17]
                    };
                }
            });
        }

    }
}
