using System.Data.SqlClient;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Models.GlobalParts;
using System.Text;

namespace AutoPartsSite.Controllers.Api
{
    public partial class SearchController
    {
        [NonAction]
        protected override Query CreateQuery()
        {
            return AppSettings.Query.GlobalParts;
        }

        [NonAction]
        private List<GoodsSearch> GetSearchGoods(string partNumber, int pageRows, int page)
        {
            List<GoodsSearch> result = new List<GoodsSearch>();
            ExecQuery((query) =>
            {
                query.Execute(@"Search\[get_search]", new SqlParameter[] 
                { 
                    new SqlParameter() { ParameterName = "@PartNumber", Value = partNumber },
                    new SqlParameter() { ParameterName = "@RowspPage" , Value = pageRows },
                    new SqlParameter() { ParameterName = "@PageNumber", Value = page }
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

        [NonAction]
        private List<Goods> GetGoods(List<GoodsSearch> goods, PartNumberQuery pq)
        {
            List<Goods> result = new List<Goods>();
            List<int> goodsId = new List<int>();
            StringBuilder xmlParts = new StringBuilder();
            xmlParts.AppendLine("<ROOT>");
            for (int i = 0, icount = goods.Count; i < icount; i++)
            {
                xmlParts.AppendLine(string.Concat("<Part PartNN=", '"', i + 1, '"', "PartId=", '"', '"', " PartNo=", '"', goods[i].PartNumber, '"', " Brand=", '"', goods[i].Brand, '"', " Quantity=", '"', 1, '"', " />"));
                goodsId.Add(goods[i].Id);
            }
            xmlParts.AppendLine("</ROOT>");

            if (goodsId.Count < 1)
                goodsId.Add(0);

            ExecQuery((query) =>
            {
                query.Execute(@"Search\[get_in]", new SqlParameter[]
                {
                        new SqlParameter() { ParameterName = "@GoodsID", Value = goodsId.ToArray() },
                }
                , onExecute: null
                , (values) =>
                {
                    result.Add(new Goods()
                    {
                        Id = (int)values[0],
                        Articul = (string)values[1],
                        PartNumber = (string)values[2],
                        Name = (string)values[3],
                        Brand = new Brand() { Id = (int)values[5], Code = (string)values[6] },
                        Country = new Country() { Id = (int)values[7], Code = (string)values[8], Name = (string)values[9] },
                        Parameters = new GoodsParameters()
                        {
                            WeightPhysical = (decimal)values[11],
                            WeightVolumetric = (decimal)values[12],
                            VolumetricDivider = (decimal)values[13],
                            LengthCm = (decimal)values[14],
                            WidthCm = (decimal)values[15],
                            HeightCm = (decimal)values[16],
                            BlockWeightChange = (bool)values[17]
                        }
                    });
                });
            });
            return result;
        }

        [NonAction]
        private string BuildPartsXML(List<GoodsSearch> goods)
        {
            StringBuilder xmlParts = new StringBuilder();
            xmlParts.AppendLine("<ROOT>");
            for (int i = 0, icount = goods.Count; i < icount; i++)
                xmlParts.AppendLine(string.Concat("<Part PartNN=", '"', i + 1, '"', "PartId=", '"', '"', " PartNo=", '"', goods[i].PartNumber, '"', " Brand=", '"', goods[i].Brand, '"', " Quantity=", '"', 1, '"', " />"));
            xmlParts.AppendLine("</ROOT>");
            return xmlParts.ToString();
        }
        [NonAction]
        private List<Goods> GetGoodsNew(List<GoodsSearch> goods, PartNumberQuery pq, bool isGuest)
        {
            List<Goods> result = new List<Goods>();
            string partsXML = BuildPartsXML(goods);

            int f_Id = -1;
            int f_Articul = -1;
            int f_PartNumber = -1;
            int f_Name = -1;
            ExecQuery((query) =>
            {
                query.Execute(@"Search\[GetPricesRetail]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = pq.languageId },
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = pq.siteUserId },
                    new SqlParameter() { ParameterName = "@IsGuest", Value = isGuest },
                    new SqlParameter() { ParameterName = "@CountryID", Value = pq.countryId },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = pq.currencyId },
                    new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                    new SqlParameter() { ParameterName = "@IsShowTotal", Value = false }
                }
                , onExecute: (reader) =>
                {

                }
                , (values) =>
                {
                    result.Add(new Goods()
                    {
                        Id = (int)values[0],
                        Articul = (string)values[1],
                        PartNumber = (string)values[2],
                        Name = (string)values[3],
                        Brand = new Brand() { Id = (int)values[5], Code = (string)values[6] },
                        Country = new Country() { Id = (int)values[7], Code = (string)values[8], Name = (string)values[9] },
                        Parameters = new GoodsParameters()
                        {
                            WeightPhysical = (decimal)values[11],
                            WeightVolumetric = (decimal)values[12],
                            VolumetricDivider = (decimal)values[13],
                            LengthCm = (decimal)values[14],
                            WidthCm = (decimal)values[15],
                            HeightCm = (decimal)values[16],
                            BlockWeightChange = (bool)values[17]
                        }
                    });
                });
            });
            return result;
        }

        //[NonAction]
        //private List<GoodsSearch> GetGoods(string partNumber, int pageRows, int page)
        //{
        //    List<GoodsSearch> result = new List<GoodsSearch>();
        //    ExecQuery((query) =>
        //    {
        //        query.Execute(@"Search\[get]", new SqlParameter[]
        //        {
        //            new SqlParameter() { ParameterName = "@PartNumber", Value = partNumber },
        //            new SqlParameter() { ParameterName = "@RowspPage" , Value = pageRows },
        //            new SqlParameter() { ParameterName = "@PageNumber", Value = page }
        //        }
        //        , (values) =>
        //        {
        //            result.Add(new GoodsSearch()
        //            {
        //                Id = (int)values[0],
        //                Articul = (string)values[1],
        //                PartNumber = (string)values[2],
        //                Name = (string)values[3],
        //                Brand = new Brand() { Id = (int)values[5], Code = (string)values[6] },
        //                Country = new Country() { Id = (int)values[7], Code = (string)values[8], Name = (string)values[9] },
        //                Parameters = new GoodsParameters()
        //                {
        //                    WeightPhysical = (decimal)values[11],
        //                    WeightVolumetric = (decimal)values[12],
        //                    VolumetricDivider = (decimal)values[13],
        //                    LengthCm = (decimal)values[14],
        //                    WidthCm = (decimal)values[15],
        //                    HeightCm = (decimal)values[16],
        //                    BlockWeightChange = (bool)values[17]
        //                },
        //                Page = (long)values[18],
        //                MaxPage = (long)values[19]
        //            });
        //        });
        //    });
        //    return result;
        //}
    }
}
