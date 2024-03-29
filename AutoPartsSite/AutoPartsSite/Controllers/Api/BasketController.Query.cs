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
using AutoPartsSite.Models;

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
        private void DeleteHeaderBasket(BasketQuery pq)
        {
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[del_header]", new SqlParameter[] { new SqlParameter() { ParameterName = "@Uid", Value = pq.uid } });
            });
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
            if (basketItemsModels.Count > 0)
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
                        new SqlParameter() { ParameterName = "@DeliveryRouteID", Value = basketItemsModels[0].DeliveryRouteID },
                        new SqlParameter() { ParameterName = "@DeliveryTariffID", Value = basketItemsModels[0].DeliveryTariffID },
                        new SqlParameter() { ParameterName = "@OrderCurrencyID", Value = basketItemsModels[0].OrderCurrencyID },
                        new SqlParameter() { ParameterName = "@OrderCurrencyRate", Value = basketItemsModels[0].OrderCurrencyRate },
                        new SqlParameter() { ParameterName = "@CartCurrencyID", Value = basketItemsModels[0].CartCurrencyID },
                        new SqlParameter() { ParameterName = "@CartCurrencyRate", Value = basketItemsModels[0].CartCurrencyRate },
                        new SqlParameter() { ParameterName = "@InvoiceCurrencyID", Value = basketItemsModels[0].InvoiceCurrencyID },
                        new SqlParameter() { ParameterName = "@InvoiceCurrencyRate", Value = basketItemsModels[0].InvoiceCurrencyRate },
                        new SqlParameter() { ParameterName = "@AccountingCurrencyID", Value = basketItemsModels[0].AccountingCurrencyID },
                        new SqlParameter() { ParameterName = "@TakeInvoicePrice", Value = (decimal)0 },
                       new SqlParameter() { ParameterName = "@InvoicePrice", Value = (decimal)0 },
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
                new SqlParameter() { ParameterName = "@SiteUserID", Value = model.Auth ? model.siteUserId : 0 },
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
                    DeliveryRouteID = values[++i].ToInt(),
                    DeliveryTariffID = values[++i].ToInt(),
                    OrderCurrencyID = values[++i].ToInt(),
                    OrderCurrencyRate = values[++i].ToDecimal(),
                    CartCurrencyID = values[++i].ToInt(),
                    CartCurrencyRate = values[++i].ToDecimal(),
                    InvoiceCurrencyID = values[++i].ToInt(),
                    InvoiceCurrencyRate = values[++i].ToDecimal(),
                    AccountingCurrencyID = values[++i].ToInt(),
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

            if (result == 0)
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
            BasketData result = new BasketData() { Header = GetBasketDataHeader(uid) };

            ExecQuery((query) =>
            {
                query.Execute(@"[get_header]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                }
                , onExecute: null
                , (values) =>
                {
                    result.Header.Id = values[0].ToInt();
                    result.Header.Uid = values[1].ToStr();
                    result.Header.DeliveryRouteID = values[2].ToInt();
                    result.Header.DeliveryTariffID = values[3].ToInt();
                    result.Header.DeliveryAddressID = values[4].ToInt();
                    result.Header.BillingAddressID = values[5].ToInt();
                    result.Header.Comment = values[6].ToStr();
                    result.Header.OrderCurrencyID = values[7].ToInt();
                    result.Header.OrderCurrencyRate = values[8].ToDecimal();
                    result.Header.CartCurrencyID = values[9].ToInt();
                    result.Header.CartCurrencyRate = values[10].ToDecimal();
                    result.Header.InvoiceCurrencyID = values[11].ToInt();
                    result.Header.InvoiceCurrencyRate = values[12].ToDecimal();
                    result.Header.AccountingCurrencyID = values[13].ToInt();
                    result.Header.PromoCode = values[14].ToStr();
                });
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
                        Quantity = values[1].ToDecimal(), Price = values[2].ToDecimal(), RowNumber = values[3].ToDecimal()
                    });
                });
            });
            return result;
        }

        [NonAction]
        private BasketDataHeader GetBasketDataHeader(string uid)
        {
            BasketDataHeader result = new BasketDataHeader();
            ExecQuery((query) =>
            {
                query.Execute(@"[get_header]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                }
                , onExecute: null
                , (values) =>
                {
                    int i = 0;
                    result.Id = values[i++].ToInt();
                    result.Uid = values[i++].ToStr();
                    result.DeliveryRouteID = values[i++].ToInt();
                    result.DeliveryTariffID = values[i++].ToInt();
                    result.DeliveryAddressID = values[i++].ToInt();
                    result.BillingAddressID = values[i++].ToInt();
                    result.Comment = values[i++].ToStr();
                    result.OrderCurrencyID = values[i++].ToInt();
                    result.OrderCurrencyRate = values[i++].ToDecimal();
                    result.CartCurrencyID = values[i++].ToInt();
                    result.CartCurrencyRate = values[i++].ToDecimal();
                    result.InvoiceCurrencyID = values[i++].ToInt();
                    result.InvoiceCurrencyRate = values[i++].ToDecimal();
                    result.AccountingCurrencyID = values[i++].ToInt();
                    result.PromoCode = values[i++].ToStr();
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
            {

                AppSettings.Query.GlobalParts.Execute(@"Search\[get_in]", new SqlParameter[]
                    {
                    new SqlParameter() { ParameterName = "@GoodsID", Value = ids.Count == 0 ? new int[] { id.Goods.Id } : ids.ToArray() },
                    }
                    , onExecute: null
                    , (values) =>
                    {
                        result.Add(new GoodsSearch()
                        {
                            RowNumber = id.RowNumber,
                            Id = (int)values[0],
                            PartNumber = (string)values[1],
                            Brand = (string)values[2],
                            Page = (int)values[3],
                            MaxPage = (int)values[4]
                        });
                    });
            }
            return result;
        }

        private void FillBasketData(BasketData data, List<GoodsSearch> goodsS, int userId, BasketQuery pq)
        {
            if (data?.Positions?.Count == 0)
                return;

            Dictionary<int, BasketGoods> result = new Dictionary<int, BasketGoods>();
            Dictionary<int, DeliveryInfo> resultDelivery = new Dictionary<int, DeliveryInfo>();
            BasketGoods goods;
            Dictionary<string, string> resultPromoCouponMessage = new Dictionary<string, string>();

            foreach (var item in data.Positions)
                if (!result.TryGetValue(item.Goods.Id, out goods))
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
            int f_CurrencyId = -1, f_CurrencyCode = -1, f_CurrencyName = -1, f_CurrencySymbol = -1, f_CurrencySymbolShowLeft = -1;
            int f_WeightPhysical = -1, f_WeightVolumetric = -1, f_LengthCm = -1, f_WidthCm = -1, f_HeightCm = -1;

            int f_PriceChanged = -1, f_QtyChanged = -1;
            int f_CartPriceRaw = -1, f_OldCartPrice = -1, f_Qty = -1, f_OldCartQty = -1;
            int f_CartAmount = -1, f_CartAmountRaw = -1, f_CartDiscountsAmount = -1;

            int f_DeliveryRouteID = -1, f_DeliveryTariffID = -1, f_DeliveryTariffCode = -1, f_DeliveryTariffDescr = -1;
            int f_Amount = -1, f_DeliveryAmount = -1, f_VatAmount = -1, f_TotalAmount = -1;
            int f_DeliveryDaysMin = -1, f_DeliveryDaysMax = -1, f_DeliveryDays = -1;
            int f_PromoCouponMessage = -1;


            AppSettings.Query.GlobalParts.Execute(@"Search\[GetPricesRetail]", new SqlParameter[]
            {
                 new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = pq.languageId },
                 new SqlParameter() { ParameterName = "@SiteUserID", Value = userId },
                 new SqlParameter() { ParameterName = "@SiteUserUID", Value = pq.uid },
                 new SqlParameter() { ParameterName = "@CountryID", Value = pq.countryId },
                 new SqlParameter() { ParameterName = "@CurrencyID", Value = pq.currencyId },
                 new SqlParameter() { ParameterName = "@PartsXML", Value = partsXML },
                 new SqlParameter() { ParameterName = "@WithSubst", Value = false },
                 new SqlParameter() { ParameterName = "@WithTotal", Value = true },
                 new SqlParameter() { ParameterName = "@WithCompare", Value = true },
                 new SqlParameter() { ParameterName = "@PromoCode", Value = (data.Header == null || string.IsNullOrEmpty(data.Header.PromoCode) ? string.Empty : data.Header.PromoCode) },
                 new SqlParameter() { ParameterName = "@Comment", Value = string.Empty }
            }
            , onExecute: (reader) =>
            {
                string fname;
                for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                {
                    fname = reader.GetName(i);
                    if (fname == "RowNumber") f_PartNn = i;
                    else if (fname == "GoodsID") f_Id = i;
                    //else if (fname == "Artikul")             f_PartNumber = i; //RequestedPartNumber
                    else if (fname == "Articul") { f_Articul = i; f_PartNumber = i; }
                    else if (fname == "Descr") f_Name = i;
                    else if (fname == "Brand") f_BrandCode = i;
                    else if (fname == "CartPrice") f_Price = i;
                    else if (fname == "ShipInDays") f_ShipInDays = i;

                    else if (fname == "PriceChanged") f_PriceChanged = i;
                    else if (fname == "QtyChanged") f_QtyChanged = i;
                    else if (fname == "CartPriceRaw") f_CartPriceRaw = i;
                    else if (fname == "OldCartPrice") f_OldCartPrice = i;
                    else if (fname == "Qty") f_Qty = i;
                    else if (fname == "OldCartQty") f_OldCartQty = i;
                    else if (fname == "CartAmount") f_CartAmount = i;
                    else if (fname == "CartAmountRaw") f_CartAmountRaw = i;
                    else if (fname == "CartDiscountsAmount") f_CartDiscountsAmount = i;

                    else if (fname == "CountryID") f_CountryId = i;
                    else if (fname == "CountryCode") f_CountryCode = i;
                    else if (fname == "CountryDescr") f_CountryName = i;

                    else if (fname == "CartCurrencyID") f_CurrencyId = i;
                    else if (fname == "CartCurrencyCode") f_CurrencyCode = i;
                    else if (fname == "CartCurrencyName") f_CurrencyName = i;
                    else if (fname == "CartCurrencySymbol") f_CurrencySymbol = i;
                    else if (fname == "CartCurrencySymbolShowLeft") f_CurrencySymbolShowLeft = i;

                    else if (fname == "WeightPhysical") f_WeightPhysical = i;
                    else if (fname == "WeightVolumetric") f_WeightVolumetric = i;
                    else if (fname == "LengthCm") f_LengthCm = i;
                    else if (fname == "WidthCm") f_WidthCm = i;
                    else if (fname == "HeightCm") f_HeightCm = i;

                    else if (fname == "DeliveryRouteID") f_DeliveryRouteID = i;
                    else if (fname == "DeliveryTariffID") f_DeliveryTariffID = i;
                    else if (fname == "DeliveryTariffCode") f_DeliveryTariffCode = i;
                    else if (fname == "DeliveryTariffDescr") f_DeliveryTariffDescr = i;
                    else if (fname == "CartAmount") f_Amount = i;
                    else if (fname == "CartDeliveryAmount") f_DeliveryAmount = i;
                    else if (fname == "CartVatAmount") f_VatAmount = i;
                    else if (fname == "CartTotalAmount") f_TotalAmount = i;
                    else if (fname == "DeliveryDaysMin") f_DeliveryDaysMin = i;
                    else if (fname == "DeliveryDaysMax") f_DeliveryDaysMax = i;
                    else if (fname == "DeliveryDays") f_DeliveryDays = i;

                    else if (fname == "PromoCouponMessage") f_PromoCouponMessage = i;
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
                            deliveryInfo = new DeliveryInfo() { Id = deliveryTariffID, Currency = new Currency() };
                            resultDelivery.Add(deliveryTariffID, deliveryInfo);
                            if (deliveryTariffID == 5) deliveryInfo.Logo = "/img/deliverybrands/dhl.png";
                            else if (deliveryTariffID == 6) deliveryInfo.Logo = "/img/deliverybrands/ups.png";

                            if (f_DeliveryRouteID > -1) deliveryInfo.DeliveryRouteID = values[f_DeliveryRouteID].ToInt();
                            if (f_DeliveryTariffCode > -1) deliveryInfo.Code = values[f_DeliveryTariffCode].ToStr();
                            if (f_DeliveryTariffDescr > -1) deliveryInfo.Name = values[f_DeliveryTariffDescr].ToStr();
                            if (f_Amount > -1) deliveryInfo.Amount = values[f_Amount].ToDecimal();
                            if (f_DeliveryAmount > -1) deliveryInfo.DeliveryAmount = values[f_DeliveryAmount].ToDecimal();
                            if (f_VatAmount > -1) deliveryInfo.VatAmount = values[f_VatAmount].ToDecimal();
                            if (f_TotalAmount > -1) deliveryInfo.TotalAmount = values[f_TotalAmount].ToDecimal();
                            if (f_DeliveryDaysMin > -1) deliveryInfo.DaysMin = values[f_DeliveryDaysMin].ToInt();
                            if (f_DeliveryDaysMax > -1) deliveryInfo.DaysMax = values[f_DeliveryDaysMax].ToInt();
                            if (f_DeliveryDays > -1) deliveryInfo.DeliveryDays = values[f_DeliveryDays].ToStr();

                            if (f_CurrencyId > -1) deliveryInfo.Currency.Id = values[f_CurrencyId].ToInt();
                            if (f_CurrencyCode > -1) deliveryInfo.Currency.Code = values[f_CurrencyCode].ToStr();
                            if (f_CurrencyName > -1) deliveryInfo.Currency.Name = values[f_CurrencyName].ToStr();
                            if (f_CurrencySymbol > -1) deliveryInfo.Currency.Symbol = values[f_CurrencySymbol].ToStr();
                            if (f_CurrencySymbolShowLeft > -1) deliveryInfo.Currency.ShowLeft = values[f_CurrencySymbolShowLeft].ToBool();
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
                    if (f_Name > -1) item.Goods.Name = values[f_Name].ToStr();
                    if (f_Articul > -1) item.Goods.Articul = values[f_Articul].ToStr();
                    if (f_Price > -1) item.Price = item.Goods.Price = values[f_Price].ToDecimal();
                    //item.Price = item.Goods.Price;
                    if (f_ShipInDays > -1) item.Goods.ShipInDays = values[f_ShipInDays].ToInt();

                    if (f_BrandId > -1) item.Goods.Brand.Id = values[f_BrandId].ToInt();
                    if (f_BrandCode > -1) item.Goods.Brand.Code = values[f_BrandCode].ToStr();

                    if (f_CountryId > -1) item.Goods.Country.Id = values[f_CountryId].ToInt();
                    if (f_CountryCode > -1) item.Goods.Country.Code = values[f_CountryCode].ToStr();
                    if (f_CountryName > -1) item.Goods.Country.Name = values[f_CountryName].ToStr();

                    if (f_CurrencyId > -1) item.Goods.Currency.Id = values[f_CurrencyId].ToInt();
                    if (f_CurrencyCode > -1) item.Goods.Currency.Code = values[f_CurrencyCode].ToStr();
                    if (f_CurrencyName > -1) item.Goods.Currency.Name = values[f_CurrencyName].ToStr();
                    if (f_CurrencySymbol > -1) item.Goods.Currency.Symbol = values[f_CurrencySymbol].ToStr();
                    if (f_CurrencySymbolShowLeft > -1) item.Goods.Currency.ShowLeft = values[f_CurrencySymbolShowLeft].ToBool();

                    if (f_WeightPhysical > -1) item.Goods.Parameters.WeightPhysical = values[f_WeightPhysical].ToDecimal();
                    if (f_WeightVolumetric > -1) item.Goods.Parameters.WeightVolumetric = values[f_WeightVolumetric].ToDecimal();
                    if (f_LengthCm > -1) item.Goods.Parameters.LengthCm = values[f_LengthCm].ToDecimal();
                    if (f_WidthCm > -1) item.Goods.Parameters.WidthCm = values[f_WidthCm].ToDecimal();
                    if (f_HeightCm > -1) item.Goods.Parameters.HeightCm = values[f_HeightCm].ToDecimal();

                    if (f_PriceChanged > -1) item.PriceChanged = values[f_PriceChanged].ToDecimal() != 0;
                    if (f_QtyChanged > -1) item.QtyChanged = values[f_PriceChanged].ToDecimal() != 0;
                    if (f_CartPriceRaw > -1) item.CartPriceRaw = values[f_CartPriceRaw].ToDecimal();
                    if (f_OldCartPrice > -1) item.OldCartPrice = values[f_OldCartPrice].ToDecimal();
                    if (f_Qty > -1) item.Qty = values[f_Qty].ToInt();
                    if (f_OldCartQty > -1) item.OldQty = values[f_OldCartQty].ToInt();
                    if (f_CartAmount > -1) item.CartAmount = values[f_CartAmount].ToDecimal();
                    if (f_CartAmountRaw > -1) item.CartAmountRaw = values[f_CartAmountRaw].ToDecimal();
                    if (f_CartDiscountsAmount > -1) item.CartDiscountsAmount = values[f_CartDiscountsAmount].ToDecimal();

                    if (f_PromoCouponMessage > -1)
                    {
                        string rpcm, pcm = values[f_PromoCouponMessage].ToStr();
                        if (!string.IsNullOrEmpty(pcm) && !resultPromoCouponMessage.TryGetValue(pcm, out rpcm))
                            resultPromoCouponMessage.Add(pcm, pcm);
                    }
                }
            });

            data.Deliveries = resultDelivery.Values.ToList();

            data.Header.PromoCouponMessage = string.Empty;
            if (resultPromoCouponMessage.Count > 0)
            {
                foreach (var pcmItem in resultPromoCouponMessage.Values)
                    data.Header.PromoCouponMessage = string.Concat(data.Header.PromoCouponMessage, string.IsNullOrEmpty(data.Header.PromoCouponMessage) ? string.Empty : "<br/>", pcmItem);
            }

        }

        [NonAction]
        private int GetCouponId(string promocode)
        {
            int result = 0;
            AppSettings.Query.GlobalParts.Execute(@"Basket\[get_coupon]", new SqlParameter[] {
                    new SqlParameter() { ParameterName = "@PromoCode", Value = promocode },
                },
                onExecute: null,
                (values) =>
                {
                    result = values[0].ToInt();
                });
            return result;
        }

        [NonAction]
        private int GetBasketDelivery(string uid)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"[get_delivery]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                },
                onExecute: null,
                (values) =>
                {
                    result = values[0].ToInt();
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
        private int GetBasketBilling(string uid)
        {
            int result = 0;
            ExecQuery((query) =>
            {
                query.Execute(@"[get_billing]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                },
                onExecute: null,
                (values) =>
                {
                    result = values[0].ToInt();
                });
            });
            return result;
        }

        [NonAction]
        private void SetBasketBilling(string uid, int billing)
        {
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery(@"[update_billing]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                    new SqlParameter() { ParameterName = "@BillingID", Value = billing },
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
                    result = values[0].ToStr();
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

        [NonAction]
        private void SetBaskeDeliveryTariffID(string uid, int deliveryTariffID, int deliveryRouteID)
        {
            ExecQuery((query) =>
            {
                query.Execute(@"[set_delivery_tariff]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@Uid", Value = uid },
                    new SqlParameter() { ParameterName = "@DeliveryTariffID", Value = deliveryTariffID },
                    new SqlParameter() { ParameterName = "@DeliveryRouteID", Value = deliveryRouteID },
                }, null, (values) => { });
            });
        }

        [NonAction]
        private AddressInfo GetAddressDefault(int userId, int deliveryId, QueryWithSettings qs, int typeAddress)
        {
            AddressInfo result = null;

            List<AddressInfo> addresses = AccountController.GetAddresses(userId, qs, typeAddress, qs.countryId);

            result = (deliveryId == 0 ? addresses.FirstOrDefault(f => f.Default) : addresses.FirstOrDefault(f => f.Id == deliveryId));
            if (result == null)
            {
                if (addresses.Count > 0)
                    result = addresses.FirstOrDefault();
                else
                {
                    addresses = AccountController.GetAddresses(userId, qs, -1, qs.countryId);
                    result = (deliveryId == 0 ? addresses.FirstOrDefault(f => f.Default) : addresses.FirstOrDefault(f => f.Id == deliveryId));
                }
            }
            
            if (result == null)
                result = new AddressInfo();

            return result;
        }

        [NonAction]
        private int SetDeliveryAddress(int userId, int typeAddress, BasketDeilveryAddress model, string email)
        {
            int result = 0;
            AppSettings.Query.GlobalParts.Execute(@"Basket\[set_address]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = userId }, //qs.siteUserId },model.qs.siteUserId },
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = model.qs.languageId },
                    new SqlParameter() { ParameterName = "@AddressID", Value = model.DeliveryAddress.Id },
                    new SqlParameter() { ParameterName = "@AddressType", Value = typeAddress },
                    new SqlParameter() { ParameterName = "@FullName", Value = model.DeliveryAddress.FullName },
                    new SqlParameter() { ParameterName = "@CountryID", Value = model.DeliveryAddress.CountryId },
                    new SqlParameter() { ParameterName = "@ZipCode", Value = model.DeliveryAddress.ZipCode },
                    new SqlParameter() { ParameterName = "@Region", Value = model.DeliveryAddress.Region },
                    new SqlParameter() { ParameterName = "@City", Value = model.DeliveryAddress.City },
                    new SqlParameter() { ParameterName = "@Address", Value = model.DeliveryAddress.Street },
                    new SqlParameter() { ParameterName = "@PhoneCode", Value = model.DeliveryAddress.PhoneCode },
                    new SqlParameter() { ParameterName = "@PhoneMain", Value = model.DeliveryAddress.Phone },
                    new SqlParameter() { ParameterName = "@PhoneExt", Value = string.Empty },
                    new SqlParameter() { ParameterName = "@Email", Value = model.DeliveryAddress.Email },
                    new SqlParameter() { ParameterName = "@DeliveryInstructions", Value = string.Empty },
                    new SqlParameter() { ParameterName = "@IsDefault", Value = true }
                }
                , onExecute: null
                , (values) =>
                {
                    result = Convert.ToInt32(values[2]);
                });

            return result;
        }

        [NonAction]
        private int SetBillingAddress(int userId, int typeAddress, BasketBillingAddress model, string email)
        {
            int result = 0;
            AppSettings.Query.GlobalParts.Execute(@"Basket\[set_address]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = userId },
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = model.qs.languageId },
                    new SqlParameter() { ParameterName = "@AddressID", Value = model.BillingAddress.Id },
                    new SqlParameter() { ParameterName = "@AddressType", Value = typeAddress },
                    new SqlParameter() { ParameterName = "@FullName", Value = model.BillingAddress.FullName },
                    new SqlParameter() { ParameterName = "@CountryID", Value = model.BillingAddress.CountryId },
                    new SqlParameter() { ParameterName = "@ZipCode", Value = model.BillingAddress.ZipCode },
                    new SqlParameter() { ParameterName = "@Region", Value = model.BillingAddress.Region },
                    new SqlParameter() { ParameterName = "@City", Value = model.BillingAddress.City },
                    new SqlParameter() { ParameterName = "@Address", Value = model.BillingAddress.Street },
                    new SqlParameter() { ParameterName = "@PhoneCode", Value = model.BillingAddress.PhoneCode },
                    new SqlParameter() { ParameterName = "@PhoneMain", Value = model.BillingAddress.Phone },
                    new SqlParameter() { ParameterName = "@PhoneExt", Value = string.Empty },
                    new SqlParameter() { ParameterName = "@Email", Value = model.BillingAddress.Email },
                    new SqlParameter() { ParameterName = "@DeliveryInstructions", Value = string.Empty },
                    new SqlParameter() { ParameterName = "@IsDefault", Value = true }
                }
                , onExecute: null
                , (values) =>
                {
                    result = Convert.ToInt32(values[2]);
                });

            return result;
        }

        [NonAction]
        private List<Payment> GetPaymentList(QueryWithSettings qs)
        {
            List<Payment> result = new List<Payment>();
            int f_SitePaymentID = -1, f_Code = -1, f_Descr = -1;
            AppSettings.Query.GlobalParts.Execute(@"Basket\[get_payments]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = qs.languageId },
                }
                , onExecute: (reader) =>
                {
                    string fname;
                    for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                    {
                        fname = reader.GetName(i);
                             if (fname == "SitePaymentID") f_SitePaymentID = i;
                        else if (fname == "Code"         ) f_Code = i;
                        else if (fname == "Descr"        ) f_Descr = i;
                    }
                }
                , (values) =>
                {
                    Payment payment = new Payment();
                    if (f_SitePaymentID > -1) payment.Id   = values[f_SitePaymentID].ToInt();
                    if (f_Code          > -1) payment.Code = values[f_Code].ToStr();
                    if (f_Descr         > -1) payment.Name = values[f_Descr].ToStr();

                    result.Add(payment);
                });

            return result;
        }


        [NonAction]
        private OrderCreateResult OrderCreateSql(int userId, QueryWithSettings qs)
        {
            OrderCreateResult result = new OrderCreateResult() { OrderHeaderID = -1 };
            int f_StatusMessage = -1, f_OrderHeaderID = -1, f_OrderNumberFull = -1, f_OrderNumber = -1;


            AppSettings.Query.GlobalParts.Execute(@"Basket\[ordercreate]", new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = userId },
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = qs.languageId }
                }
                , onExecute: (reader) =>
                {
                    string fname;
                    for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                    {
                        fname = reader.GetName(i);
                             if (fname == "StatusMessage")   f_StatusMessage = i;
                        else if (fname == "OrderHeaderID")   f_OrderHeaderID = i;
                        else if (fname == "OrderNumberFull") f_OrderNumberFull = i;
                        else if (fname == "OrderNumber")     f_OrderNumber = i;
                    }
                }
                , (values) =>
                {
                    if (f_StatusMessage > -1) result.StatusMessage = values[f_StatusMessage].ToStr();
                    if (f_OrderHeaderID > -1) result.OrderHeaderID = values[f_OrderHeaderID].ToInt();
                    if (f_OrderNumberFull > -1) result.OrderNumberFull = values[f_OrderNumberFull].ToStr();
                    if (f_OrderNumber > -1) result.OrderNumber = values[f_OrderNumber].ToDecimal();
                });
            return result;
        }

        [NonAction]
        private void ClearBasket(QueryWithSettings qs)
        {
            List<Payment> result = new List<Payment>();
            ExecQuery((query) =>
            {
                query.ExecuteNonQuery("[clear]", new SqlParameter[]
                    {
                    new SqlParameter() { ParameterName = "@Uid", Value = qs.uid }
                    });
            });

        }
    }
}
