using System.Collections.Generic;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Mvc;
using AutoPartsSite.Models.GlobalParts;
using System;
using System.Linq;
using AutoPartsSite.Models.Account;
using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Models;

namespace AutoPartsSite.Controllers.Api
{
    public partial class AccountController
    {
        [NonAction]
        internal static int SetUserUid(string uid, int userId = 0)
        {
            int result = 0;
            AppSettings.Query.Basket.Execute(@"[set_user_uid]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Uid", string.IsNullOrEmpty(uid) ? (object)DBNull.Value : uid),
                    new SqlParameter("@User", userId)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result = Convert.ToInt32(values[0]);
                });
            return result;
        }

        [NonAction]
        internal static UserUid GetUserUid(string uid)
        {
            UserUid result = new UserUid();
            AppSettings.Query.Basket.Execute(@"[get_user_uid]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@Uid", string.IsNullOrEmpty(uid) ? (object)DBNull.Value : uid),
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Id = values[0].ToInt();
                    result.Uid = values[1].ToStr();
                    result.User = values[2].ToInt();
                });
            return result;
        }

        [NonAction]
        internal static List<Country> GetCountries(int langId, int countryId = 0, string code = null)
        {
            List<Country> result = new List<Country>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_countries]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId),
                    new SqlParameter("@CountryID", countryId == 0 ? (object)DBNull.Value : countryId),
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Country() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr() });
                });
            return result;
        }

        [NonAction]
        internal static List<Lang> GetLanguages(int langId, int languageId, string code = null)
        {
            List<Lang> result = new List<Lang>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_languages]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId == 0 ? (object)DBNull.Value : langId),
                    new SqlParameter("@LanguageID", languageId == 0 ? (object)DBNull.Value : languageId),
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Lang() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr().Trim() });
                });
            return result;
        }

        [NonAction]
        internal List<Currency> GetCurrencies(int langId, int currencyId = 0, string code = null)
        {
            List<Currency> result = new List<Currency>();
            AppSettings.Query.GlobalParts.Execute(@"Settings\[get_currencies]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId == 0 ? (object)DBNull.Value : langId),
                    new SqlParameter("@CurrencyID", currencyId == 0 ? (object)DBNull.Value : currencyId),
                    new SqlParameter("@Code", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new Currency() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr(), Symbol = values[4].ToStr(), ShowLeft = values[5].ToBool() });
                });
            return result;
        }

        #region STATUSES

        internal StatusInfo GetOrderStatus(int langId, string code)
        {
            StatusInfo result;
            List<StatusInfo> lis = GetOrderStatuses(langId, "Order.Header.New");
            if (lis.Count > 0)
                result = lis[0];
            else
                result = new StatusInfo()
                {
                    Status = new Status() { Id = 1, Code = "Order.Header.New", Name = "New" },
                    StatusType = new StatusType() { Id = 1, Code = "Order.Header", Name = "Order header" }
                };
            return result;
        }

        [NonAction]
        internal List<StatusInfo> GetOrderStatuses(int langId, string code = null)
        {
            List<StatusInfo> result = new List<StatusInfo>();
            AppSettings.Query.GlobalParts.Execute(@"Account\[get_status]"
               , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId),
                    new SqlParameter("@StatusCode", string.IsNullOrEmpty(code) ? (object)DBNull.Value : code)
                }
                , onExecute: null
                , action: (values) =>
                {
                    result.Add(new StatusInfo() { 
                        Status = new Status() { Id = values[0].ToInt(), Code = values[1].ToStr().Trim(), Name = values[2].ToStr() },
                        StatusType = new StatusType() { Id = values[3].ToInt(), Code = values[4].ToStr().Trim(), Name = values[5].ToStr() }
                    });
                });
            return result;
        }
        #endregion

        #region ORDERS

        [NonAction]
        internal static List<Order> GetOrders(int userId, int orderId, QueryWithSettings qs)
        {
            List<Order> result = new List<Order>();

            int f_OrderHeaderID = -1, f_OrderNumberFull = -1, f_OrderDate = -1, f_Comment = -1;
            int f_OrderCurrencyID = -1, f_OrderCurrencyCode = -1;
            int f_DeliveryTariffID = -1, f_DeliveryTariffDescr = -1;

            int f_StatusID = -1, f_StatusCode = -1, f_StatusDescr = -1;
            int f_StatusTypeID = -1, f_StatusTypeCode = -1, f_StatusTypeDescr = -1;

            AppSettings.Query.GlobalParts.Execute(@"Account\[r_OrderGet]"
                , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", qs.languageId),
                    new SqlParameter("@SiteUserID", userId),
                    new SqlParameter("@OrderHeaderID", orderId)
                }
                , onExecute: (reader) =>
                {
                    string fname;
                    for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                    {
                        fname = reader.GetName(i);
                             if (fname == "OrderHeaderID")   f_OrderHeaderID = i;
                        else if (fname == "OrderNumberFull") f_OrderNumberFull = i; 
                        else if (fname == "OrderDate")       f_OrderDate = i; 
                        else if (fname == "Comment")         f_Comment = i;

                        else if (fname == "OrderCurrencyID") f_OrderCurrencyID = i;
                        else if (fname == "OrderCurrencyCode") f_OrderCurrencyCode = i;

                        else if (fname == "DeliveryTariffID")    f_DeliveryTariffID = i;
                        else if (fname == "DeliveryTariffDescr") f_DeliveryTariffDescr = i;

                        else if (fname == "StatusID")    f_StatusID = i;
                        else if (fname == "StatusCode")  f_StatusCode = i;
                        else if (fname == "StatusDescr") f_StatusDescr = i;

                        else if (fname == "StatusTypeID")    f_StatusTypeID = i;
                        else if (fname == "StatusTypeCode")  f_StatusTypeCode = i;
                        else if (fname == "StatusTypeDescr") f_StatusTypeDescr = i;
                    }
                }
                , action: (values) =>
                {
                    Order order = new Order() { Currency = new Currency(), Delivery = new DeliveryInfo(), Status = new Status(), StatusType = new StatusType() };
                    if (f_OrderHeaderID   > -1) order.OrderHeaderID   = values[f_OrderHeaderID].ToInt();
                    if (f_OrderNumberFull > -1) order.OrderNumberFull = values[f_OrderNumberFull].ToStr();
                    if (f_OrderDate       > -1) order.OrderDate       = values[f_OrderDate].ToDateTime();
                    if (f_Comment         > -1) order.Comment         = values[f_Comment].ToStr();
                    if (f_OrderCurrencyID   > -1) order.Currency.Id   = values[f_OrderCurrencyID].ToInt();
                    if (f_OrderCurrencyCode > -1) order.Currency.Code = values[f_OrderCurrencyCode].ToStr();
                    if (f_DeliveryTariffID    > -1) order.Delivery.Id   = values[f_DeliveryTariffID].ToInt();
                    if (f_DeliveryTariffDescr > -1) order.Delivery.Name = values[f_DeliveryTariffDescr].ToStr();

                    if (f_StatusID > -1)    order.Status.Id   = values[f_StatusID].ToInt();
                    if (f_StatusCode > -1)  order.Status.Code = values[f_StatusCode].ToStr();
                    if (f_StatusDescr > -1) order.Status.Name = values[f_StatusDescr].ToStr();

                    if (f_StatusTypeID > -1)    order.StatusType.Id   = values[f_StatusTypeID].ToInt();
                    if (f_StatusTypeCode > -1)  order.StatusType.Code = values[f_StatusTypeCode].ToStr();
                    if (f_StatusTypeDescr > -1) order.StatusType.Name = values[f_StatusTypeDescr].ToStr();

                    result.Add(order);
                });
            return result;
        }

        private List<OrderInfoItem> OrderItems(int orderId, QueryWithSettings qs)
        {
            List<OrderInfoItem> result = new List<OrderInfoItem>();
            int f_OrderItemID = -1, f_Id = -1, f_Articul = -1, f_PartNumber = -1, f_Name = -1, f_BrandCode = -1;
            int f_Qty = -1, f_CartPrice = -1, f_CartAmount = -1, f_CartDeliveryAmount = -1, f_CartVatAmount = -1, f_CartVatTotalAmount = -1;

            int f_StatusID = -1, f_StatusCode = -1, f_StatusDescr = -1;
            int f_StatusTypeID = -1, f_StatusTypeCode = -1, f_StatusTypeDescr = -1;

            AppSettings.Query.GlobalParts.Execute(@"Account\[r_OrderItemGet]", new SqlParameter[]
            {
                 new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = qs.languageId },
                 new SqlParameter() { ParameterName = "@OrderHeaderID", Value = orderId },
            }
            , onExecute: (reader) =>
            {
                string fname;
                for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                {
                    fname = reader.GetName(i);
                         if (fname == "OrderItemID") f_OrderItemID = i;
                    else if(fname == "GoodsID") f_Id = i;
                    else if (fname == "Articul") { f_Articul = i; f_PartNumber = i; }
                    else if (fname == "Descr") f_Name = i;
                    else if (fname == "Brand") f_BrandCode = i;
                    else if (fname == "Qty") f_Qty = i;

                    else if (fname == "CartPrice") f_CartPrice = i;
                    else if (fname == "CartAmount") f_CartAmount = i;
                    else if (fname == "CartDeliveryAmount") f_CartDeliveryAmount = i;
                    else if (fname == "CartVatAmount") f_CartVatAmount = i;
                    else if (fname == "CartVatTotalAmount") f_CartVatTotalAmount = i;

                    else if (fname == "StatusID") f_StatusID = i;
                    else if (fname == "StatusCode") f_StatusCode = i;
                    else if (fname == "StatusDescr") f_StatusDescr = i;

                    else if (fname == "StatusTypeID") f_StatusTypeID = i;
                    else if (fname == "StatusTypeCode") f_StatusTypeCode = i;
                    else if (fname == "StatusTypeDescr") f_StatusTypeDescr = i;
                }
            }
            , (values) =>
            {
                int id = 0;
                if (f_OrderItemID > -1)
                    id = values[f_OrderItemID].ToInt();
                else
                    return;


                OrderInfoItem item = new OrderInfoItem() { OrderItemID = id, Brand = new Brand(), Status = new Status(), StatusType = new StatusType() };
                result.Add(item);

                if (f_Id > -1) item.Id = values[f_Id].ToInt();
                if (f_PartNumber > -1) item.PartNumber = values[f_PartNumber].ToStr();
                if (f_Name > -1) item.Name = values[f_Name].ToStr();
                if (f_Articul > -1) item.Articul = values[f_Articul].ToStr();
                if (f_BrandCode > -1) item.Brand.Code = values[f_BrandCode].ToStr();

                if (f_Qty > -1) item.Qty = values[f_Qty].ToDecimal();
                if (f_CartPrice > -1) item.Price = values[f_CartPrice].ToDecimal();

                if (f_CartAmount > -1) item.Amount = values[f_CartAmount].ToDecimal();
                if (f_CartDeliveryAmount > -1) item.DeliveryAmount = values[f_CartDeliveryAmount].ToDecimal();
                if (f_CartVatAmount > -1) item.VatAmount = values[f_CartVatAmount].ToDecimal();
                if (f_CartVatTotalAmount > -1) item.TotalAmount = values[f_CartVatTotalAmount].ToDecimal();

                if (f_StatusID > -1)    item.Status.Id   = values[f_StatusID].ToInt();
                if (f_StatusCode > -1)  item.Status.Code = values[f_StatusCode].ToStr();
                if (f_StatusDescr > -1) item.Status.Name = values[f_StatusDescr].ToStr();

                if (f_StatusTypeID > -1)    item.StatusType.Id   = values[f_StatusTypeID].ToInt();
                if (f_StatusTypeCode > -1)  item.StatusType.Code = values[f_StatusTypeCode].ToStr();
                if (f_StatusTypeDescr > -1) item.StatusType.Name = values[f_StatusTypeDescr].ToStr();
            });

            return result;

        }

        [NonAction]
        internal List<StatusInfo> UpdateOrderStatus(int langId, int orderId, StatusInfo si)
        {
            List<StatusInfo> result = new List<StatusInfo>();
            AppSettings.Query.GlobalParts.ExecuteNonQuery(@"Account\[update_status_order]"
               , sqlParameters: new SqlParameter[]
                {
                    new SqlParameter("@LocaleLanguageID", langId),
                    new SqlParameter("@CrudType", 2),
                    new SqlParameter("@OrderHeaderID ", orderId),
                    new SqlParameter("@StatusID", si.Status.Id),
                    new SqlParameter("@OrderHeaderStatusID", si.StatusType.Id),
                    new SqlParameter("@Comment", string.Empty)
                });
            return result;
        }

        [NonAction]
        private List<AddressInfo> GetAddress(int orderId, QueryWithSettings qs, int typeAddress)
        {
            List<AddressInfo> result = new List<AddressInfo>();
           

            int f_Id = -1, f_FullName = -1;
            int f_CompanyId = -1, f_CompanyCode = -1, f_CompanyName = -1;
            int f_CountryId = -1, f_CountryCode = -1, f_CountryName = -1;
            int f_ZipCode = -1, f_Region = -1, f_City = -1, f_Address = -1;
            int f_PhoneCode = -1, f_PhoneMain = -1, f_PhoneExt = -1, f_Email = -1;
            int f_Default = -1;

            AppSettings.Query.GlobalParts.Execute(@"Account\[r_OrderAddressGet]"
                , new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = qs.languageId },
                    new SqlParameter() { ParameterName = "@OrderHeaderID",  Value = orderId },
                    new SqlParameter() { ParameterName = "@AddressTypeID",  Value = typeAddress }
                }
                , onExecute: (reader) =>
                {
                    string fname;
                    for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                    {
                        fname = reader.GetName(i);
                             if (fname == "OrderAddressID")    f_Id       = i;
                        else if (fname == "FullName")     f_FullName = i;

                        else if (fname == "CompanyID")    f_CompanyId   = i;
                        else if (fname == "ComapnyCode")  f_CompanyCode = i;
                        else if (fname == "ComapnyDescr") f_CompanyName = i;

                        else if (fname == "CountryID")    f_CountryId   = i;
                        else if (fname == "CountryCode")  f_CountryCode = i;
                        else if (fname == "CountryDescr") f_CountryName = i;

                        else if (fname == "ZipCode")      f_ZipCode = i;
                        else if (fname == "Region")       f_Region  = i;
                        else if (fname == "City")         f_City    = i;
                        else if (fname == "Address")      f_Address = i;

                        else if (fname == "PhoneCode")    f_PhoneCode = i;
                        else if (fname == "PhoneMain")    f_PhoneMain = i;
                        else if (fname == "PhoneExt")     f_PhoneExt  = i;
                        else if (fname == "Email")        f_Email     = i;

                        
                        else if (fname == "IsDefault")      f_Default   = i;
                    }
                }
                , (values) =>
                {
                    AddressInfo item = new AddressInfo() { Company = new Company(), Country = new Country() } ;

                    if (f_Id          > -1) item.Id           = values[f_Id].ToInt();
                    if (f_FullName    > -1) item.FullName     = values[f_FullName].ToStr();

                    if (f_CompanyId   > -1) item.CompanyId    = item.Company.Id = values[f_CompanyId].ToInt();
                    if (f_CompanyCode > -1) item.Company.Code = values[f_CompanyCode].ToStr();
                    if (f_CompanyName > -1) item.Company.Name = values[f_CompanyName].ToStr();

                    if (f_CountryId   > -1) item.CountryId    = item.Country.Id = values[f_CountryId].ToInt();
                    if (f_CountryCode > -1) item.Country.Code = values[f_CountryCode].ToStr();
                    if (f_CountryName > -1) item.Country.Name = values[f_CountryName].ToStr();

                    if (f_ZipCode     > -1) item.ZipCode      = values[f_ZipCode].ToStr();
                    if (f_Region      > -1) item.Region       = values[f_Region].ToStr();
                    if (f_City        > -1) item.City         = values[f_City].ToStr();
                    if (f_Address     > -1) item.Street       = values[f_Address].ToStr();

                    if (f_PhoneCode   > -1) item.PhoneCode    = values[f_PhoneCode].ToStr();
                    if (f_PhoneMain   > -1) item.Phone        = values[f_PhoneMain].ToStr();
                    if (f_PhoneExt    > -1) item.PhoneExt     = values[f_PhoneExt].ToStr();
                    if (f_Email       > -1) item.Email        = values[f_Email].ToStr();

                    if (f_Default     > -1) item.Default      = values[f_Default].ToBool();

                    result.Add(item);
                });

            return result;
        }
        #endregion

        #region Address
        [NonAction]
        internal static List<AddressInfo> GetAddresses(int userId, QueryWithSettings qs, int typeAddress = -1, int countryId = -1)
        {
            List<AddressInfo> result = new List<AddressInfo>();

            int f_Id = -1, f_FullName = -1;
            int f_CompanyId = -1, f_CompanyCode = -1, f_CompanyName = -1;
            int f_CountryId = -1, f_CountryCode = -1, f_CountryName = -1;
            int f_ZipCode = -1, f_Region = -1, f_City = -1, f_Address = -1;
            int f_PhoneCode = -1, f_PhoneMain = -1, f_PhoneExt = -1, f_Email = -1;
            int f_Default = -1, f_AddressTypeId = -1, f_UserId = -1;

            AppSettings.Query.GlobalParts.Execute(@"Account\[get_address]"
                , new SqlParameter[]
                {
                    new SqlParameter() { ParameterName = "@AddressTypeID", Value = typeAddress },
                    new SqlParameter() { ParameterName = "@SiteUserID", Value = userId }, 
                    new SqlParameter() { ParameterName = "@LocaleLanguageID", Value = qs.languageId },
                    new SqlParameter() { ParameterName = "@CountryID", Value = countryId }
                }
                , onExecute: (reader) =>
                {
                    string fname;
                    for (int i = 0, icount = reader.FieldCount; i < icount; i++)
                    {
                        fname = reader.GetName(i);
                        if (fname == "AddressID") f_Id = i;
                        else if (fname == "FullName") f_FullName = i;

                        else if (fname == "CompanyID") f_CompanyId = i;
                        else if (fname == "ComapnyCode") f_CompanyCode = i;
                        else if (fname == "ComapnyDescr") f_CompanyName = i;

                        else if (fname == "CountryID") f_CountryId = i;
                        else if (fname == "CountryCode") f_CountryCode = i;
                        else if (fname == "CountryDescr") f_CountryName = i;

                        else if (fname == "ZipCode") f_ZipCode = i;
                        else if (fname == "Region") f_Region = i;
                        else if (fname == "City") f_City = i;
                        else if (fname == "Address") f_Address = i;

                        else if (fname == "PhoneCode") f_PhoneCode = i;
                        else if (fname == "PhoneMain") f_PhoneMain = i;
                        else if (fname == "PhoneExt") f_PhoneExt = i;
                        else if (fname == "Email") f_Email = i;

                        else if (fname == "IsDefault") f_Default = i;
                        else if (fname == "AddressType") f_AddressTypeId = i;
                        else if (fname == "UserID") f_UserId = i;
                    }
                }
                , (values) =>
                {
                    AddressInfo item = new AddressInfo() { Company = new Company(), Country = new Country() };

                    if (f_Id > -1) item.Id = values[f_Id].ToInt();
                    if (f_FullName > -1) item.FullName = values[f_FullName].ToStr();

                    if (f_CompanyId > -1) item.CompanyId = item.Company.Id = values[f_CompanyId].ToInt();
                    if (f_CompanyCode > -1) item.Company.Code = values[f_CompanyCode].ToStr();
                    if (f_CompanyName > -1) item.Company.Name = values[f_CompanyName].ToStr();

                    if (f_CountryId > -1) item.CountryId = item.Country.Id = values[f_CountryId].ToInt();
                    if (f_CountryCode > -1) item.Country.Code = values[f_CountryCode].ToStr();
                    if (f_CountryName > -1) item.Country.Name = values[f_CountryName].ToStr();

                    if (f_ZipCode > -1) item.ZipCode = values[f_ZipCode].ToStr();
                    if (f_Region > -1) item.Region = values[f_Region].ToStr();
                    if (f_City > -1) item.City = values[f_City].ToStr();
                    if (f_Address > -1) item.Street = values[f_Address].ToStr();

                    if (f_PhoneCode > -1) item.PhoneCode = values[f_PhoneCode].ToStr();
                    if (f_PhoneMain > -1) item.Phone = values[f_PhoneMain].ToStr();
                    if (f_PhoneExt > -1) item.PhoneExt = values[f_PhoneExt].ToStr();
                    if (f_Email > -1) item.Email = values[f_Email].ToStr();

                    if (f_Default > -1) item.Default = values[f_Default].ToBool();
                    if (f_AddressTypeId > -1) item.AddressTypeId = values[f_AddressTypeId].ToDecimal();
                    if (f_UserId > -1) item.UserId = values[f_UserId].ToInt();
                    result.Add(item);
                });

            return result;
        }
        #endregion
    }
}
