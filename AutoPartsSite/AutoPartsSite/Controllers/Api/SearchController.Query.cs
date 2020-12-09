﻿using System.Linq;
using System.Data.SqlClient;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Models.GlobalParts;
using System.Text;
using AutoPartsSite.Core.Extensions;

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
        internal static string BuildPartsXML(List<GoodsSearch> goods)
        {
            StringBuilder xmlParts = new StringBuilder();
            xmlParts.AppendLine("<ROOT>");
            for (int i = 0, icount = goods.Count; i < icount; i++)
                xmlParts.AppendLine(string.Concat("    <Part RowNumber=", '"', i + 1, '"', " GoodsId=", '"', '"', " PartNumber=", '"', goods[i].PartNumber, '"', " Brand=", '"', goods[i].Brand, '"', " Qty=", '"', goods[i].Quantity > 0 ? goods[i].Quantity : 1, '"', " />"));
            xmlParts.AppendLine("</ROOT>");
            return xmlParts.ToString();
        }

        [NonAction]
        private List<Goods> GetGoods(List<GoodsSearch> goods, PartNumberQuery pq, bool isGuest)
        {
           
            string partsXML = BuildPartsXML(goods);

            int f_Id = -1, f_Articul = -1, f_PartNumber = -1, f_Name = -1, f_Price = -1, f_ShipInDays = -1;
            int f_BrandId = -1, f_BrandCode = -1;
            int f_CountryId = -1, f_CountryCode = -1, f_CountryName = -1;
            int f_CurrencyId = -1, f_CurrencyCode = -1, f_CurrencyName = -1, f_CurrencySymbol = -1;
            int f_WeightPhysical = -1, f_WeightVolumetric = -1, f_LengthCm = -1, f_WidthCm = -1, f_HeightCm = -1;

            Dictionary<int, Goods> result = new Dictionary<int, Goods>();

            ExecQuery((query) =>
            {
                query.Execute(@"Search\[GetPricesRetail]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = pq.languageId },
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = pq.siteUserId },
                    new SqlParameter() { ParameterName = "@SiteUserUID", Value = pq.uid },
                    new SqlParameter() { ParameterName = "@CountryID", Value = pq.countryId },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = pq.currencyId },
                    new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                    new SqlParameter() { ParameterName = "@WithSubst", Value = false },
                    new SqlParameter() { ParameterName = "@WithTotal", Value = false },
                    new SqlParameter() { ParameterName = "@WithCompare", Value = false },
                    new SqlParameter() { ParameterName = "@PromoCode", Value = string.Empty }
                }
                , onExecute: (reader) =>
                {
                    string fname;
                    for(int i = 0, icount = reader.FieldCount; i< icount; i++)
                    {
                        fname = reader.GetName(i);
                             if (fname == "GoodsID") f_Id = i;
                        else if (fname == "RequestedPartNumber") f_PartNumber = i;
                        else if (fname == "Artikul") f_Articul = i;
                        else if (fname == "Descr") f_Name = i;
                        else if (fname == "Brand") f_BrandCode = i;
                        else if (fname == "OrderPriceRaw") f_Price = i;
                        else if (fname == "ShipInDays") f_ShipInDays = i;

                        else if (fname == "CountryID")   f_CountryId = i;
                        else if (fname == "CountryCode") f_CountryCode = i;
                        else if (fname == "CountryDescr") f_CountryName = i;

                        else if (fname == "OrderCurrencyID")   f_CurrencyId = i;
                        else if (fname == "OrderCurrencyCode") f_CurrencyCode = i;
                        else if (fname == "OrderCurrencyName") f_CurrencyName = i;
                        else if (fname == "OrderCurrencySymbol") f_CurrencySymbol = i;

                        else if (fname == "WeightPhysical") f_WeightPhysical = i;
                        else if (fname == "WeightVolumetric") f_WeightVolumetric = i;
                        else if (fname == "LengthCm") f_LengthCm = i;
                        else if (fname == "WidthCm")  f_WidthCm = i;
                        else if (fname == "HeightCm") f_HeightCm = i;
                    }
                }
                , (values) =>
                {
                    int id = 0;
                    if (f_Id > -1) id = values[f_Id].ToInt();
                    if(id > 0)
                    {
                        Goods item = null;
                        if (!result.TryGetValue(id, out item))
                        {
                            item = new Goods() { Id = id, Brand = new Brand(), Country = new Country(), Currency = new Currency(), Parameters = new GoodsParameters() };
                            result.Add(id, item);
                        }
                        if (f_PartNumber > -1) item.PartNumber = values[f_PartNumber].ToStr();
                        if (f_Articul    > -1) item.Articul    = values[f_Articul].ToStr();
                        if (f_Name       > -1) item.Name       = values[f_Name].ToStr();
                        if (f_Price      > -1) item.Price      = values[f_Price].ToDecimal();
                        if (f_ShipInDays > -1) item.ShipInDays = values[f_ShipInDays].ToInt();

                        if (f_BrandId   > -1) item.Brand.Id   = values[f_BrandId].ToInt();
                        if (f_BrandCode > -1) item.Brand.Code = values[f_BrandCode].ToStr();

                        if (f_CountryId   > -1) item.Country.Id   = values[f_CountryId].ToInt();
                        if (f_CountryCode > -1) item.Country.Code = values[f_CountryCode].ToStr();
                        if (f_CountryName > -1) item.Country.Name = values[f_CountryName].ToStr();

                        if (f_CurrencyId     > -1) item.Currency.Id     = values[f_CurrencyId].ToInt();
                        if (f_CurrencyCode   > -1) item.Currency.Code   = values[f_CurrencyCode].ToStr();
                        if (f_CurrencyName   > -1) item.Currency.Name   = values[f_CurrencyName].ToStr();
                        if (f_CurrencySymbol > -1) item.Currency.Symbol = values[f_CurrencySymbol].ToStr();

                        if (f_WeightPhysical   > -1) item.Parameters.WeightPhysical   = values[f_WeightPhysical].ToDecimal();
                        if (f_WeightVolumetric > -1) item.Parameters.WeightVolumetric = values[f_WeightVolumetric].ToDecimal();
                        if (f_LengthCm         > -1) item.Parameters.LengthCm         = values[f_LengthCm].ToDecimal();
                        if (f_WidthCm          > -1) item.Parameters.WidthCm          = values[f_WidthCm].ToDecimal();
                        if (f_HeightCm         > -1) item.Parameters.HeightCm         = values[f_HeightCm].ToDecimal();
                    }
                });
            });
            return result.Values.ToList();
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
