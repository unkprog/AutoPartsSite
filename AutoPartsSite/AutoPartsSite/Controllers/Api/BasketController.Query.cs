using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using System.Data.SqlClient;
using System;
using AutoPartsSite.Models.Basket;
using AutoPartsSite.Models.GlobalParts;
using System.Linq;
using System.Collections.Generic;
using System.Text;

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

        [NonAction]
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

        [NonAction]
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


        [NonAction]
        private BasketData GetBasketData(BasketQuery pq, bool isGuest)
        {
            BasketData result = new BasketData();
            ExecQuery((query) =>
            {
                query.Execute(@"[get]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = pq.uid },
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
            return result;
        }

        [NonAction]
        private List<GoodsSearch> GetBasketGoods(BasketData data)
        {
            List<GoodsSearch> result = new List<GoodsSearch>();
            List<int> ids = new List<int>();
            foreach (var id in data.Positions)
                ids.Add(id.Goods.Id);

            ExecQuery((query) =>
            {
                query.Execute(@"Search\[get_in]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@GoodsID", Value = ids.ToArray() },
                }
                , onExecute: null
                , (values) =>
                {
                    result.Add(new GoodsSearch()
                    {
                        Id = (int)values[0],
                        PartNumber = (string)values[1],
                        Brand = (string)values[2],
                        Page = (long)values[3],
                        MaxPage = (long)values[4]
                    });
                });
            });
            return result;
        }

        private void FillBasketData(BasketData data, List<GoodsSearch> goodsS)
        {
            if (data?.Positions?.Count == 0)
                return;

            Dictionary<int, BasketGoods> result = new Dictionary<int, BasketGoods>();
            BasketGoods goods;
            int id;
            foreach (var item in data.Positions)
                if(!result.TryGetValue(item.Goods.Id, out goods))
                    result.Add(item.Goods.Id, item);

            foreach (var item in goodsS)
                if (result.TryGetValue(item.Id, out goods))
                {
                    item.Quantity = goods.Quantity;
                }

            string partsXML = SearchController.BuildPartsXML(goodsS);

            int f_Id = -1, f_Articul = -1, f_PartNumber = -1, f_Name = -1, f_Price = -1, f_ShipInDays = -1;
            int f_BrandId = -1, f_BrandCode = -1;
            int f_CountryId = -1, f_CountryCode = -1, f_CountryName = -1;
            int f_CurrencyId = -1, f_CurrencyCode = -1, f_CurrencyName = -1, f_CurrencySymbol = -1;
            int f_WeightPhysical = -1, f_WeightVolumetric = -1, f_LengthCm = -1, f_WidthCm = -1, f_HeightCm = -1;


            AppSettings.Query.GlobalParts.Execute(@"Search\[get_in]", new SqlParameter[]
            {
                new SqlParameter() { ParameterName = "@GoodsID", Value = result.Keys.ToArray() }
            }
            , onExecute: null
            , (values) =>
            {
                //id = (int)values[0];
                //if(result.TryGetValue(id, out goods))
                //{
                //    goods.Goods.Articul = (string)values[1];
                //    goods.Goods.PartNumber = (string)values[2];
                //    goods.Name = (string)values[3];
                //    goods.Brand = new Brand() { Id = (int)values[5], Code = (string)values[6] };
                //    goods.Country = new Country() { Id = (int)values[7], Code = (string)values[8], Name = (string)values[9] };
                //    goods.Parameters = new GoodsParameters()
                //    {
                //        WeightPhysical = (decimal)values[11],
                //        WeightVolumetric = (decimal)values[12],
                //        VolumetricDivider = (decimal)values[13],
                //        LengthCm = (decimal)values[14],
                //        WidthCm = (decimal)values[15],
                //        HeightCm = (decimal)values[16],
                //        BlockWeightChange = (bool)values[17]
                //    };
                //}
            });
        }

    }
}
