using System.Linq;
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
        private List<Goods> GetGoods(List<GoodsSearch> goods, PartNumberQuery pq, bool WithSubst)
        {
           
            string partsXML = BuildPartsXML(goods);

            int f_Id = -1, f_Articul = -1, f_PartNumber = -1, f_Name = -1, f_Price = -1, f_StockQty = -1, f_ShipInDays = -1;
            int f_BrandId = -1, f_BrandCode = -1;
            int f_CountryId = -1, f_CountryCode = -1, f_CountryName = -1;
            int f_CurrencyId = -1, f_CurrencyCode = -1, f_CurrencyName = -1, f_CurrencySymbol = -1;
            int f_WeightPhysical = -1, f_WeightVolumetric = -1, f_LengthCm = -1, f_WidthCm = -1, f_HeightCm = -1;

            int f_DeliveryTariffID = -1, f_DeliveryTariffCode = -1, f_DeliveryTariffDescr = -1;
            int f_Amount = -1, f_DeliveryAmount = -1, f_VatAmount = -1, f_TotalAmount = -1;
            int f_DeliveryDaysMin = -1, f_DeliveryDaysMax = -1;

            Dictionary<int, Goods> result = new Dictionary<int, Goods>();

            ExecQuery((query) =>
            {
                query.Execute(@"Search\[GetPricesRetail]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = pq.siteUserId },
                    //new SqlParameter() { ParameterName = "@SiteUserUID", Value = pq.uid },
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = pq.languageId },
                    new SqlParameter() { ParameterName = "@CountryID", Value = pq.countryId },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = pq.currencyId },
                    new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                    new SqlParameter() { ParameterName = "@WithSubst", Value = WithSubst },
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
                        else if (fname == "CartPrice") f_Price = i;
                        else if (fname == "StockQty") f_StockQty = i;
                        else if (fname == "ShipInDays") f_ShipInDays = i;

                        else if (fname == "CountryID")   f_CountryId = i;
                        else if (fname == "CountryCode") f_CountryCode = i;
                        else if (fname == "CountryDescr") f_CountryName = i;

                        else if (fname == "CartCurrencyID")   f_CurrencyId = i;
                        else if (fname == "CartCurrencyCode") f_CurrencyCode = i;
                        else if (fname == "CartCurrencyName") f_CurrencyName = i;
                        else if (fname == "CartCurrencySymbol") f_CurrencySymbol = i;

                        else if (fname == "WeightPhysical") f_WeightPhysical = i;
                        else if (fname == "WeightVolumetric") f_WeightVolumetric = i;
                        else if (fname == "LengthCm") f_LengthCm = i;
                        else if (fname == "WidthCm")  f_WidthCm = i;
                        else if (fname == "HeightCm") f_HeightCm = i;

                        else if (fname == "DeliveryTariffID") f_DeliveryTariffID = i;
                        else if (fname == "DeliveryTariffCode") f_DeliveryTariffCode = i;
                        else if (fname == "DeliveryTariffDescr") f_DeliveryTariffDescr = i;
                        else if (fname == "CartAmount") f_Amount = i;
                        else if (fname == "CartDeliveryAmount") f_DeliveryAmount = i;
                        else if (fname == "CartVatAmount") f_VatAmount = i;
                        else if (fname == "CartTotalAmount") f_TotalAmount = i;
                        else if (fname == "DeliveryDaysMin") f_DeliveryDaysMin = i;
                        else if (fname == "DeliveryDaysMax") f_DeliveryDaysMax = i;
                    }
                }
                , (values) =>
                {
                    int id = 0;
                    if (f_Id > -1) id = values[f_Id].ToInt();
                    if (id > 0)
                    {
                        Goods item = null;
                        if (!result.TryGetValue(id, out item))
                        {
                            item = new Goods() { Id = id, Brand = new Brand(), Country = new Country(), Currency = new Currency(), Parameters = new GoodsParameters(), Deliveries = new List<DeliveryInfo>() };
                            result.Add(id, item);
                        }
                        if (f_PartNumber > -1) item.PartNumber = values[f_PartNumber].ToStr();
                        if (f_Articul > -1) item.Articul = values[f_Articul].ToStr();
                        if (f_Name > -1) item.Name = values[f_Name].ToStr();
                        if (f_Price > -1) item.Price = values[f_Price].ToDecimal();
                        if (f_StockQty > -1) item.StockQty = values[f_StockQty].ToInt();
                        if (f_ShipInDays > -1) item.ShipInDays = values[f_ShipInDays].ToInt();

                        if (f_BrandId > -1) item.Brand.Id = values[f_BrandId].ToInt();
                        if (f_BrandCode > -1) item.Brand.Code = values[f_BrandCode].ToStr();

                        if (f_CountryId > -1) item.Country.Id = values[f_CountryId].ToInt();
                        if (f_CountryCode > -1) item.Country.Code = values[f_CountryCode].ToStr();
                        if (f_CountryName > -1) item.Country.Name = values[f_CountryName].ToStr();

                        if (f_CurrencyId > -1) item.Currency.Id = values[f_CurrencyId].ToInt();
                        if (f_CurrencyCode > -1) item.Currency.Code = values[f_CurrencyCode].ToStr();
                        if (f_CurrencyName > -1) item.Currency.Name = values[f_CurrencyName].ToStr();
                        if (f_CurrencySymbol > -1) item.Currency.Symbol = values[f_CurrencySymbol].ToStr();

                        if (f_WeightPhysical > -1) item.Parameters.WeightPhysical = values[f_WeightPhysical].ToDecimal();
                        if (f_WeightVolumetric > -1) item.Parameters.WeightVolumetric = values[f_WeightVolumetric].ToDecimal();
                        if (f_LengthCm > -1) item.Parameters.LengthCm = values[f_LengthCm].ToDecimal();
                        if (f_WidthCm > -1) item.Parameters.WidthCm = values[f_WidthCm].ToDecimal();
                        if (f_HeightCm > -1) item.Parameters.HeightCm = values[f_HeightCm].ToDecimal();

                        int deliveryTariffID = -1;
                        if (f_DeliveryTariffID > -1) deliveryTariffID = values[f_DeliveryTariffID].ToInt();
                        if (deliveryTariffID > 0)
                        {
                            DeliveryInfo deliveryInfo;
                            deliveryInfo = new DeliveryInfo() { Id = deliveryTariffID };
                            if (deliveryTariffID == 8) deliveryInfo.Logo = "/img/deliverybrands/dhl.png";
                            else if (deliveryTariffID == 9) deliveryInfo.Logo = "/img/deliverybrands/ups.png";

                            if (f_DeliveryTariffCode > -1) deliveryInfo.Code = values[f_DeliveryTariffCode].ToStr();
                            if (f_DeliveryTariffDescr > -1) deliveryInfo.Name = values[f_DeliveryTariffDescr].ToStr();
                            if (f_Amount > -1) deliveryInfo.Amount = values[f_Amount].ToDecimal();
                            if (f_DeliveryAmount > -1) deliveryInfo.DeliveryAmount = values[f_DeliveryAmount].ToDecimal();
                            if (f_VatAmount > -1) deliveryInfo.VatAmount = values[f_VatAmount].ToDecimal();
                            if (f_TotalAmount > -1) deliveryInfo.TotalAmount = values[f_TotalAmount].ToDecimal();
                            if (f_DeliveryDaysMin > -1) deliveryInfo.DaysMin = values[f_DeliveryDaysMin].ToInt();
                            if (f_DeliveryDaysMax > -1) deliveryInfo.DaysMax = values[f_DeliveryDaysMax].ToInt();
                            item.Deliveries.Add(deliveryInfo);
                        }
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
