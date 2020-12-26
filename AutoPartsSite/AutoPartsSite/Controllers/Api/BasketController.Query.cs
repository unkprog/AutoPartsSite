﻿using Microsoft.AspNetCore.Mvc;
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
        private decimal UpdatePartBasket(BasketQuery pq, bool isAdd = false)
        {
            decimal result = pq.qty;
            
            List<BasketGoods> positions = new List<BasketGoods>();
            positions.Add(new BasketGoods() { Goods = new Goods() { Id = pq.id }, Quantity = pq.qty });
            List<GoodsSearch> goods = GetBasketGoods(positions);
            string partsXML = string.Empty;// SearchController.BuildPartsXML(goods);
            int DeliveryTariffID = GetBasketDelivery(pq, out partsXML);

            List<BasketItemsModel> basketItemsModels = GetBasketPrices(pq, DeliveryTariffID, partsXML);
            if(basketItemsModels.Count > 0)
                ExecQuery((query) =>
                {
                    query.ExecuteNonQuery(isAdd ? @"[add]" : @"[update]", new SqlParameter[]
                    {
                        new SqlParameter() { ParameterName = "@Uid", Value = pq.uid },
                        new SqlParameter() { ParameterName = "@GoodsID", Value = pq.id },
                        new SqlParameter() { ParameterName = "@Quantity", Value = pq.qty },
                        new SqlParameter() { ParameterName = "@Brand", Value = basketItemsModels[0].Brand },
                        new SqlParameter() { ParameterName = "@Articul", Value = basketItemsModels[0].Articul },
                        new SqlParameter() { ParameterName = "@Descr", Value = basketItemsModels[0].Descr },
                        new SqlParameter() { ParameterName = "@WeightPhysical", Value = basketItemsModels[0].WeightPhysical },
                        new SqlParameter() { ParameterName = "@WeightVolumetric", Value = basketItemsModels[0].WeightVolumetric },
                        new SqlParameter() { ParameterName = "@VolumetricDivider", Value = basketItemsModels[0].VolumetricDivider },
                        new SqlParameter() { ParameterName = "@PromoCouponRate", Value = basketItemsModels[0].PromoCouponRate },
                        new SqlParameter() { ParameterName = "@VatRate", Value = basketItemsModels[0].VatRate },
                        new SqlParameter() { ParameterName = "@OrderPriceRaw", Value = basketItemsModels[0].OrderPriceRaw },
                        new SqlParameter() { ParameterName = "@OrderAmountRaw", Value = basketItemsModels[0].OrderAmountRaw },
                        new SqlParameter() { ParameterName = "@OrderDiscounts", Value = basketItemsModels[0].OrderDiscounts },
                        new SqlParameter() { ParameterName = "@OrderDiscountsAmount", Value = basketItemsModels[0].OrderDiscountsAmount },
                        new SqlParameter() { ParameterName = "@OrderPrice", Value = basketItemsModels[0].OrderPrice },
                        new SqlParameter() { ParameterName = "@OrderAmount", Value = basketItemsModels[0].OrderAmount },
                        new SqlParameter() { ParameterName = "@OrderDeliveryAmount", Value = basketItemsModels[0].OrderDeliveryAmount },
                        new SqlParameter() { ParameterName = "@OrderTotalAmount", Value = basketItemsModels[0].OrderTotalAmount },
                        new SqlParameter() { ParameterName = "@OrderVatAmount", Value = basketItemsModels[0].OrderVatAmount },
                        new SqlParameter() { ParameterName = "@OrderVatTotalAmount", Value = basketItemsModels[0].OrderVatTotalAmount },
                        new SqlParameter() { ParameterName = "@CartPriceRaw", Value = basketItemsModels[0].CartPriceRaw },
                        new SqlParameter() { ParameterName = "@CartAmountRaw", Value = basketItemsModels[0].CartAmountRaw },
                        new SqlParameter() { ParameterName = "@CartDiscounts", Value = basketItemsModels[0].CartDiscounts },
                        new SqlParameter() { ParameterName = "@CartDiscountsAmount", Value = basketItemsModels[0].CartDiscountsAmount },
                        new SqlParameter() { ParameterName = "@CartPrice", Value = basketItemsModels[0].CartPrice },
                        new SqlParameter() { ParameterName = "@CartAmount", Value = basketItemsModels[0].CartAmount },
                        new SqlParameter() { ParameterName = "@CartDeliveryAmount", Value = basketItemsModels[0].CartDeliveryAmount },
                        new SqlParameter() { ParameterName = "@CartTotalAmount", Value = basketItemsModels[0].CartTotalAmount },
                        new SqlParameter() { ParameterName = "@CartVatAmount", Value = basketItemsModels[0].CartVatAmount },
                        new SqlParameter() { ParameterName = "@CartVatTotalAmount", Value = basketItemsModels[0].CartVatTotalAmount },
                        new SqlParameter() { ParameterName = "@Comment", Value = basketItemsModels[0].Comment },
                        new SqlParameter() { ParameterName = "@TakeInvoicePrice", Value = (decimal)0 },
                        new SqlParameter() { ParameterName = "@InvoicePrice", Value = (decimal)0 }
                    });
                });
            return result;
        }

        [NonAction]
        private List<BasketItemsModel> GetBasketPrices(BasketQuery model, int DeliveryTariffID, string partsXML)
        {
            List<BasketItemsModel> result = new List<BasketItemsModel>();

            AppSettings.Query.GlobalParts.Execute(@"Basket\[get_prices]", new SqlParameter[]
            {
                new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = model.languageId },
                new SqlParameter() { ParameterName = "@SiteUserID", Value = model.siteUserId },
                new SqlParameter() { ParameterName = "@SiteUserUID", Value = model.uid },
                new SqlParameter() { ParameterName = "@CountryID", Value = model.countryId },
                new SqlParameter() { ParameterName = "@CurrencyID", Value = model.currencyId },
                new SqlParameter() { ParameterName = "@DeliveryTariffID", Value = DeliveryTariffID },
                new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                new SqlParameter() { ParameterName = "@WithSubst", Value = false },
                new SqlParameter() { ParameterName = "@WithTotal", Value = false },
                new SqlParameter() { ParameterName = "@WithCompare", Value = false },
                new SqlParameter() { ParameterName = "@PromoCode", Value = string.Empty },
                new SqlParameter() { ParameterName = "@Comment", Value = string.Empty }
            }
            , onExecute: null
            , (values) =>
            {
                int i = 0;
                result.Add(new BasketItemsModel()
                {
                    GoodsID = model.id,
                    Uid = model.uid,
                    Qty = values[++i].ToInt(),
                    Brand = values[++i].ToStr(),
                    Articul = values[++i].ToStr(),
                    Descr = values[++i].ToStr(),
                    WeightPhysical = values[++i].ToDecimal(),
                    WeightVolumetric = values[++i].ToDecimal(),
                    VolumetricDivider = values[++i].ToDecimal(),
                    PromoCouponRate = values[++i].ToDecimal(),
                    VatRate = values[++i].ToDecimal(),
                    OrderPriceRaw = values[++i].ToDecimal(),
                    OrderAmountRaw = values[++i].ToDecimal(),
                    OrderDiscounts = values[++i].ToDecimal(),
                    OrderDiscountsAmount = values[++i].ToDecimal(),
                    OrderPrice = values[++i].ToDecimal(),
                    OrderAmount = values[++i].ToDecimal(),
                    OrderDeliveryAmount = values[++i].ToDecimal(),
                    OrderTotalAmount = values[++i].ToDecimal(),
                    OrderVatAmount = values[++i].ToDecimal(),
                    OrderVatTotalAmount = values[++i].ToDecimal(),
                    CartPriceRaw = values[++i].ToDecimal(),
                    CartAmountRaw = values[++i].ToDecimal(),
                    CartDiscounts = values[++i].ToDecimal(),
                    CartDiscountsAmount = values[++i].ToDecimal(),
                    CartPrice = values[++i].ToDecimal(),
                    CartAmount = values[++i].ToDecimal(),
                    CartDeliveryAmount = values[++i].ToDecimal(),
                    CartTotalAmount = values[++i].ToDecimal(),
                    CartVatAmount = values[++i].ToDecimal(),
                    CartVatTotalAmount = values[++i].ToDecimal(),
                    Comment = values[++i].ToStr(),
                    //TakeInvoicePrice = values[++i].ToDecimal(),
                    //InvoicePrice = values[++i].ToDecimal()
                });
            });

            return result;
        }

        [NonAction]
        private int GetBasketDelivery(BasketQuery model, out string partsXML)
        {
            int result = 0;
            List<BasketGoods> positions = new List<BasketGoods>();
            positions.Add(new BasketGoods() { Goods = new Goods() { Id = model.id }, Quantity = model.qty });
            List<GoodsSearch> goods = GetBasketGoods(positions);
            string pXML = SearchController.BuildPartsXML(goods);
            partsXML = pXML;
            ExecQuery((query) =>
            {
                query.Execute(@"[get_delivery_tariff]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = model.uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = model.id },
                    new SqlParameter() { ParameterName = "@Quantity", Value = model.qty },
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = model.languageId },
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = model.siteUserId },
                    new SqlParameter() { ParameterName = "@SiteUserUID", Value = model.uid },
                    new SqlParameter() { ParameterName = "@CountryID", Value = model.countryId },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = model.currencyId },
                    new SqlParameter() { ParameterName = "@PartsXML", Value = pXML },
                    new SqlParameter() { ParameterName = "@WithSubst", Value = false },
                    new SqlParameter() { ParameterName = "@WithTotal", Value = false },
                    new SqlParameter() { ParameterName = "@WithCompare", Value = false },
                    new SqlParameter() { ParameterName = "@PromoCode", Value = string.Empty },
                    new SqlParameter() { ParameterName = "@Comment", Value = string.Empty }
                }
                , onExecute: null
                , (values) =>
                {
                    result = values[0].ToInt();
                });
            });

            if(result == 0)
            {
                AppSettings.Query.GlobalParts.Execute(@"Basket\[get_delivery_tariff]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = model.uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = model.id },
                    new SqlParameter() { ParameterName = "@Quantity", Value = model.qty },
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = model.languageId },
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = model.siteUserId },
                    new SqlParameter() { ParameterName = "@SiteUserUID", Value = model.uid },
                    new SqlParameter() { ParameterName = "@CountryID", Value = model.countryId },
                    new SqlParameter() { ParameterName = "@CurrencyID", Value = model.currencyId },
                    new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                    new SqlParameter() { ParameterName = "@WithSubst", Value = false },
                    new SqlParameter() { ParameterName = "@WithTotal", Value = false },
                    new SqlParameter() { ParameterName = "@WithCompare", Value = false },
                    new SqlParameter() { ParameterName = "@PromoCode", Value = string.Empty },
                    new SqlParameter() { ParameterName = "@Comment", Value = string.Empty }
                }
                , onExecute: null
                , (values) =>
                {
                    result = values[0].ToInt();
                });
            }
            return result;
        }

        [NonAction]
        private void DeletePartBasket(BasketQuery pq)
        {
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[del]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = pq.uid },
                    new SqlParameter() { ParameterName = "@GoodsID", Value = pq.id },
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
                        Goods = new Goods() { Id = values[0].ToInt(), Brand = new Brand(), Country = new Country(), Currency = new Currency(), Parameters = new GoodsParameters() },
                        Quantity = values[1].ToDecimal(), Price = values[2].ToDecimal()
                    });
                });
            });
            return result;
        }

        [NonAction]
        private List<GoodsSearch> GetBasketGoods(List<BasketGoods> positions)
        {
            List<GoodsSearch> result = new List<GoodsSearch>();
            List<int> ids = new List<int>();
            foreach (var id in positions)
                ids.Add(id.Goods.Id);

            AppSettings.Query.GlobalParts.Execute(@"Search\[get_in]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@GoodsID", Value = ids.Count == 0 ? new int[] { 0 } : ids.ToArray() },
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
            int f_DeliveryDaysMin = -1, f_DeliveryDaysMax = -1;

            AppSettings.Query.GlobalParts.Execute(@"Search\[GetPricesRetail]", new SqlParameter[]
            {
                 new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = pq.languageId },
                 new SqlParameter() { ParameterName = "@SiteUserID", Value = pq.siteUserId },
                 new SqlParameter() { ParameterName = "@SiteUserUID", Value = pq.uid },
                 new SqlParameter() { ParameterName = "@CountryID", Value = pq.countryId },
                 new SqlParameter() { ParameterName = "@CurrencyID", Value = pq.currencyId },
                 new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                 new SqlParameter() { ParameterName = "@WithSubst", Value = false },
                 new SqlParameter() { ParameterName = "@WithTotal", Value = true },
                 new SqlParameter() { ParameterName = "@WithCompare", Value = false },
                 new SqlParameter() { ParameterName = "@PromoCode", Value = string.Empty },
                 new SqlParameter() { ParameterName = "@Comment", Value = string.Empty }
            }
            , onExecute: (reader) =>
            {
                string fname;
                for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                {
                    fname = reader.GetName(i);
                         if (fname == "RowNumber")           f_PartNn = i;
                    else if (fname == "GoodsID")             f_Id = i;
                    else if (fname == "RequestedPartNumber") f_PartNumber = i;
                    else if (fname == "Artikul")             f_Articul = i;
                    else if (fname == "Descr")               f_Name = i;
                    else if (fname == "Brand")               f_BrandCode = i;
                    else if (fname == "CartPrice")           f_Price = i;
                    else if (fname == "ShipInDays")          f_ShipInDays = i;

                    else if (fname == "CountryID")           f_CountryId = i;
                    else if (fname == "CountryCode")         f_CountryCode = i;
                    else if (fname == "CountryDescr")        f_CountryName = i;

                    else if (fname == "CartCurrencyID")      f_CurrencyId = i;
                    else if (fname == "CartCurrencyCode")    f_CurrencyCode = i;
                    else if (fname == "CartCurrencyName")    f_CurrencyName = i;
                    else if (fname == "CartCurrencySymbol")  f_CurrencySymbol = i;

                    else if (fname == "WeightPhysical")      f_WeightPhysical = i;
                    else if (fname == "WeightVolumetric")    f_WeightVolumetric = i;
                    else if (fname == "LengthCm")            f_LengthCm = i;
                    else if (fname == "WidthCm")             f_WidthCm = i;
                    else if (fname == "HeightCm")            f_HeightCm = i;

                    else if (fname == "DeliveryTariffID")    f_DeliveryTariffID = i;
                    else if (fname == "DeliveryTariffCode")  f_DeliveryTariffCode = i;
                    else if (fname == "DeliveryTariffDescr") f_DeliveryTariffDescr = i;
                    else if (fname == "CartAmount")          f_Amount = i;
                    else if (fname == "CartDeliveryAmount")  f_DeliveryAmount = i;
                    else if (fname == "CartVatAmount")       f_VatAmount = i;
                    else if (fname == "CartTotalAmount")     f_TotalAmount = i;
                    else if (fname == "DeliveryDaysMin")     f_DeliveryDaysMin = i;
                    else if (fname == "DeliveryDaysMax")     f_DeliveryDaysMax = i;

                }
            }
            , (values) =>
            {
                int id = 0;
                if (f_Id > -1) id = values[f_Id].ToInt();
                if (id == 0)
                {
                    int deliveryTariffID = -1;
                    if (f_DeliveryTariffID > -1) deliveryTariffID = values[f_DeliveryTariffID].ToInt();
                    if (deliveryTariffID > 0)
                    {
                        DeliveryInfo deliveryInfo;
                        if (!resultDelivery.TryGetValue(deliveryTariffID, out deliveryInfo))
                        {
                            deliveryInfo = new DeliveryInfo() { Id = deliveryTariffID };
                            resultDelivery.Add(deliveryTariffID, deliveryInfo);
                                 if (deliveryTariffID == 8) deliveryInfo.Logo = "/img/deliverybrands/dhl.png";
                            else if (deliveryTariffID == 9) deliveryInfo.Logo = "/img/deliverybrands/ups.png";

                            if (f_DeliveryTariffCode  > -1) deliveryInfo.Code           = values[f_DeliveryTariffCode].ToStr();
                            if (f_DeliveryTariffDescr > -1) deliveryInfo.Name           = values[f_DeliveryTariffDescr].ToStr();
                            if (f_Amount              > -1) deliveryInfo.Amount         = values[f_Amount].ToDecimal();
                            if (f_DeliveryAmount      > -1) deliveryInfo.DeliveryAmount = values[f_DeliveryAmount].ToDecimal();
                            if (f_VatAmount           > -1) deliveryInfo.VatAmount      = values[f_VatAmount].ToDecimal();
                            if (f_TotalAmount         > -1) deliveryInfo.TotalAmount    = values[f_TotalAmount].ToDecimal();
                            if (f_DeliveryDaysMin     > -1) deliveryInfo.DaysMin        = values[f_DeliveryDaysMin].ToInt();
                            if (f_DeliveryDaysMax     > -1) deliveryInfo.DaysMax        = values[f_DeliveryDaysMax].ToInt();
                        }
                    }
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
                        item = new BasketGoods() { Goods = new Goods() { Id = id, Brand = new Brand(), Country = new Country(), Currency = new Currency(), Parameters = new GoodsParameters(), Deliveries = new List<DeliveryInfo>() } };
                        result.Add(id, item);
                    }
                    if (f_PartNumber > -1) item.Goods.PartNumber = values[f_PartNumber].ToStr();
                    if (f_Name       > -1) item.Goods.Name = values[f_Name].ToStr();
                    if (f_Articul    > -1) item.Goods.Articul = values[f_Articul].ToStr();
                    if (f_Price      > -1) item.Goods.Price = values[f_Price].ToDecimal();
                    //item.Price = item.Goods.Price;
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

            data.Deliveries = resultDelivery.Values.ToList();
        }

        [NonAction]
        private int AddDelivery(BasketDeilvery model)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"[add_delivery]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@FirstName", Value = model.FirstName },
                    new SqlParameter() { ParameterName = "@LastName", Value = model.LastName },
                    new SqlParameter() { ParameterName = "@CountryID", Value = model.CountryID },
                    new SqlParameter() { ParameterName = "@City", Value = model.City },
                    new SqlParameter() { ParameterName = "@Zipcode", Value = model.Zipcode },
                    new SqlParameter() { ParameterName = "@Street", Value = model.Street },
                    new SqlParameter() { ParameterName = "@Phone", Value = model.Phone }
                }
                , onExecute: null
                , (values) =>
                {
                    result = Convert.ToInt32(values[0]);
                });
            });
            return result;
        }

        [NonAction]
        private void SetBasketDelivery(string uid, int delivery)
        {
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[update_delivery]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                    new SqlParameter() { ParameterName = "@DeliveryID", Value = delivery },
                });
            });
        }

        [NonAction]
        private string GetBaskePromoCode(string uid)
        {
            string result = string.Empty;
            ExecQuery((query) =>
            {
                query.Execute(@"[get_promocode]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid }
                }
                , onExecute: null
                , (values) =>
                {
                    result = Convert.ToString(values[0]);
                });
            });
            return result;
        }

        [NonAction]
        private void SetBaskePromoCode(string uid, string promocode)
        {
            ExecQuery((query) =>
            {
                query.Execute(@"[set_promocode]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                    new SqlParameter() { ParameterName = "@PromoCode", Value = promocode },
                }, null, (values)=>{ });
            });
        }
    }
}
