using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Core.Sql;
using System.Data.SqlClient;
using System;
using AutoPartsSite.Models.Basket;
using AutoPartsSite.Models.GlobalParts;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using AutoPartsSite.Core.Extensions;

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
                        Goods = new Goods() { Id = (int)values[0], Brand = new Brand(), Country = new Country(), Currency = new Currency(), Parameters = new GoodsParameters() },
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

            AppSettings.Query.GlobalParts.Execute(@"Search\[get_in]", new SqlParameter[]
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
                        Page = (int)values[3],
                        MaxPage = (int)values[4]
                    });
                });
            
            return result;
        }

        private void FillBasketData(BasketData data, List<GoodsSearch> goodsS, BasketQuery pq, bool isGuest)
        {
            if (data?.Positions?.Count == 0)
                return;

            Dictionary<int, BasketGoods> result = new Dictionary<int, BasketGoods>();
            Dictionary<int, DeliveryInfo> resultDelivery = new Dictionary<int, DeliveryInfo>();
            BasketGoods goods;

            foreach (var item in data.Positions)
                if(!result.TryGetValue(item.Goods.Id, out goods))
                    result.Add(item.Goods.Id, item);

            foreach (var item in goodsS)
                if (result.TryGetValue(item.Id, out goods))
                {
                    item.Quantity = goods.Quantity;
                }

            string partsXML = SearchController.BuildPartsXML(goodsS);

            int f_PartNn = -1, f_Id = -1, f_Articul = -1, f_PartNumber = -1, f_Name = -1, f_Price = -1, f_ShipInDays = -1;
            int f_BrandId = -1, f_BrandCode = -1;
            int f_CountryId = -1, f_CountryCode = -1, f_CountryName = -1;
            int f_CurrencyId = -1, f_CurrencyCode = -1, f_CurrencyName = -1, f_CurrencySymbol = -1;
            int f_WeightPhysical = -1, f_WeightVolumetric = -1, f_LengthCm = -1, f_WidthCm = -1, f_HeightCm = -1;

            int f_DeliveryTariffID = -1, f_DeliveryTariffCode = -1, f_DeliveryTariffDescr = -1;
            int f_Amount = -1, f_DeliveryAmount = -1, f_VatAmount = -1, f_TotalAmount = -1;

            AppSettings.Query.GlobalParts.Execute(@"Search\[GetPricesRetail]", new SqlParameter[]
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
                string fname;
                for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                {
                    fname = reader.GetName(i);
                         if (fname == "PartNn")              f_PartNn = i;
                    else if (fname == "GoodsID")             f_Id = i;
                    else if (fname == "RequestedPartNumber") f_PartNumber = i;
                    else if (fname == "Artikul")             f_Articul = i;
                    else if (fname == "Descr")               f_Name = i;
                    else if (fname == "Brand")               f_BrandCode = i;
                    else if (fname == "Price")               f_Price = i;
                    else if (fname == "ShipInDays")          f_ShipInDays = i;

                    else if (fname == "CountryID")           f_CountryId = i;
                    else if (fname == "CountryCode")         f_CountryCode = i;
                    else if (fname == "CountryDescr")        f_CountryName = i;

                    else if (fname == "CurrencyID")          f_CurrencyId = i;
                    else if (fname == "CurrencyCode")        f_CurrencyCode = i;
                    else if (fname == "CurrencyName")        f_CurrencyName = i;
                    else if (fname == "CurrencySymbol")      f_CurrencySymbol = i;

                    else if (fname == "WeightPhysical")      f_WeightPhysical = i;
                    else if (fname == "WeightVolumetric")    f_WeightVolumetric = i;
                    else if (fname == "LengthCm")            f_LengthCm = i;
                    else if (fname == "WidthCm")             f_WidthCm = i;
                    else if (fname == "HeightCm")            f_HeightCm = i;

                    else if (fname == "DeliveryTariffID")    f_DeliveryTariffID = i;
                    else if (fname == "DeliveryTariffCode")  f_DeliveryTariffCode = i;
                    else if (fname == "DeliveryTariffDescr") f_DeliveryTariffDescr = i;
                    else if (fname == "Amount")              f_Amount = i;
                    else if (fname == "DeliveryAmount")      f_DeliveryAmount = i;
                    else if (fname == "VatAmount")           f_VatAmount = i;
                    else if (fname == "TotalAmount")         f_TotalAmount = i;

                }
            }
            , (values) =>
            {
                int id = 0;
                if (f_Id > -1) id = values[f_Id].ToInt();
                if (id < 0)
                {
                    //int deliveryTariffID = -1;
                    //if (f_DeliveryTariffID > -1) deliveryTariffID = values[f_DeliveryTariffID].ToInt();
                    //if (deliveryTariffID > 0)
                    //{
                    //    DeliveryInfo deliveryInfo;
                    //    if (!resultDelivery.TryGetValue(deliveryTariffID, out deliveryInfo))
                    //    {
                    //        deliveryInfo = new DeliveryInfo() { Id = deliveryTariffID };
                    //        resultDelivery.Add(deliveryTariffID, deliveryInfo);
                    //        if (f_DeliveryTariffCode  > -1) deliveryInfo.Code           = values[f_DeliveryTariffCode].ToStr();
                    //        if (f_DeliveryTariffDescr > -1) deliveryInfo.Name           = values[f_DeliveryTariffDescr].ToStr();
                    //        if (f_Amount              > -1) deliveryInfo.Amount         = values[f_Amount].ToDecimal();
                    //        if (f_DeliveryAmount      > -1) deliveryInfo.DeliveryAmount = values[f_DeliveryAmount].ToDecimal();
                    //        if (f_VatAmount           > -1) deliveryInfo.VatAmount      = values[f_VatAmount].ToDecimal();
                    //        if (f_TotalAmount         > -1) deliveryInfo.TotalAmount    = values[f_TotalAmount].ToDecimal();
                    //    }
                    //}
                }
                else
                {
                    int partNn = -1;
                    if (f_PartNn > -1) partNn = values[f_PartNn].ToInt();
                    if (partNn < 1)
                        return;

                    BasketGoods item = null;
                    if (!result.TryGetValue(id, out item))
                    {
                        item = new BasketGoods() { Goods = new Goods() { Id = id, Brand = new Brand(), Country = new Country(), Currency = new Currency(), Parameters = new GoodsParameters() } };
                        result.Add(id, item);
                    }
                    if (f_PartNumber > -1) item.Goods.PartNumber = values[f_PartNumber].ToStr();
                    if (f_Name       > -1) item.Goods.Name = values[f_Name].ToStr();
                    if (f_Articul    > -1) item.Goods.Articul = values[f_Articul].ToStr();
                    if (f_Price      > -1) item.Goods.Price = values[f_Price].ToDecimal();
                    item.Price = item.Goods.Price;
                    if (f_ShipInDays > -1) item.Goods.ShipInDays = values[f_ShipInDays].ToInt();

                    if (f_BrandId   > -1) item.Goods.Brand.Id = values[f_BrandId].ToInt();
                    if (f_BrandCode > -1) item.Goods.Brand.Code = values[f_BrandCode].ToStr();

                    if (f_CountryId   > -1) item.Goods.Country.Id = values[f_CountryId].ToInt();
                    if (f_CountryCode > -1) item.Goods.Country.Code = values[f_CountryCode].ToStr();
                    if (f_CountryName > -1) item.Goods.Country.Name = values[f_CountryName].ToStr();

                    if (f_CurrencyId     > -1) item.Goods.Currency.Id = values[f_CurrencyId].ToInt();
                    if (f_CurrencyCode   > -1) item.Goods.Currency.Code = values[f_CurrencyCode].ToStr();
                    if (f_CurrencyName   > -1) item.Goods.Currency.Name = values[f_CurrencyName].ToStr();
                    if (f_CurrencySymbol > -1) item.Goods.Currency.Symbol = values[f_CurrencySymbol].ToStr();

                    if (f_WeightPhysical   > -1) item.Goods.Parameters.WeightPhysical = values[f_WeightPhysical].ToDecimal();
                    if (f_WeightVolumetric > -1) item.Goods.Parameters.WeightVolumetric = values[f_WeightVolumetric].ToDecimal();
                    if (f_LengthCm         > -1) item.Goods.Parameters.LengthCm = values[f_LengthCm].ToDecimal();
                    if (f_WidthCm          > -1) item.Goods.Parameters.WidthCm = values[f_WidthCm].ToDecimal();
                    if (f_HeightCm         > -1) item.Goods.Parameters.HeightCm = values[f_HeightCm].ToDecimal();
                }
            });
        }

    }
}
