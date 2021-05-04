using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Util.Exporter.Models;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel
    {
        public partial class TaskExport
        {
            internal string getTempFolder()
            {
                string result = string.Empty;

                query.Execute("[prices_temp_folder]"
                   , new SqlParameter[] { new SqlParameter("@LocaleLanguageID", expCAM?.CompanyAgreement?.Language?.ID) }
                   , null
                   , (values) =>
                   {
                       result = values[0].ToStr().Trim();
                   });

                if (string.IsNullOrEmpty(result))
                    result = pathExport;

                return result;
            }

            internal List<BrandModel> readSplitBrands(ExportCompanyAgreementModel model)
            {
                List<BrandModel> result = new List<BrandModel>();
                query.Execute("[brands_split]"
                   , new SqlParameter[]
                   {
                       new SqlParameter("@CurrencyID", model!.CompanyAgreement!.PriceCurrencyID),
                       new SqlParameter("AnaloguesSeparateFile", model!.CompanyAgreement!.AnaloguesSeparateFile),
                       new SqlParameter("@TariffSeparateFile", model!.CompanyAgreement!.TariffSeparateFile)
                   }
                   , null
                   , (values) =>
                   {
                       BrandModel brand = new BrandModel()
                       {
                           ID = values[0].ToInt(),
                           Code = values[1].ToStr().Trim(),
                           NonGenuine = values[2].ToInt(),
                           DeliveryTariffID = values[3].ToInt()
                       };
                       result.Add(brand);
                   });

                return result;
            }

            private Dictionary<string, ColumnModel> readColumns(int? priceFileFormatID)
            {
                Dictionary<string, ColumnModel> result = new Dictionary<string, ColumnModel>();

                query.Execute("[columns]"
                    , new SqlParameter[] { new SqlParameter("@PriceFileFormatID", priceFileFormatID) }
                    , null
                    , (values) =>
                    {
                        ColumnModel col = new ColumnModel()
                        {
                            ID = values[0].ToInt(),
                            Index = values[1].ToDecimal(),
                            ColumnNameInside = values[2].ToStr().Trim(),
                            ColumnNameClient = values[3].ToStr().Trim(),
                            ReplaceSeparator = values[4].ToBool()
                        };
                        if (!result.ContainsKey(col.ColumnNameInside))
                            result.Add(col.ColumnNameInside, col);
                    });

                return result;
            }

            internal PriceFileNameGetModel? readPriceFileNameGetModel(ExportCompanyAgreementModel model, BrandModel? brand)
            {
                PriceFileNameGetModel? result = null;
                query.Execute("[price_file_name_get]"
                   , new SqlParameter[]
                   {
                       new SqlParameter("@CustomerAgreementID", model!.CompanyAgreement!.Agreement!.ID),
                       new SqlParameter("@DeliveryTariffID", brand == null || brand.DeliveryTariffID < 0 ? 0 : (object)brand.DeliveryTariffID),
                       new SqlParameter("@BrandID", brand == null || brand.ID < 0 ? 0 : (object)brand.ID),
                       new SqlParameter("@NonGenuine", brand == null|| brand.NonGenuine < 0 ? 0 : (object)brand.NonGenuine)
                   }
                   , null
                   , (values) =>
                   {
                       result = new PriceFileNameGetModel()
                       {
                           PriceFileName = values[0].ToStr().Trim(),
                           CustomerAgreementID = values[1].ToInt(),
                           DeliveryTariffID = values[2].ToInt(),
                           BrandID = values[3].ToInt(),
                           AllOriginal = values[4].ToBool(),
                           AllAnalogue = values[5].ToBool()
                       };
                   });

                return result;
            }

            internal void savePricesCreateFilesInside(SavePricesCreateFilesInsideModel model)
            {
                query.ExecuteNonQuery("[insert_prices_create_files_inside]"
                   , new SqlParameter[]
                   {
                       new SqlParameter("@CustomerAgreementID", model!.model!.CompanyAgreement!.Agreement!.ID),
                       new SqlParameter("@PriceFileName", model!.pfngm!.PriceFileName),
                       new SqlParameter("@StartDate", model!.startDate),
                       new SqlParameter("@EndDate", model!.endDate),
                       new SqlParameter("@DeliveryTariffID", model!.brand == null ? 0 : model!.brand.DeliveryTariffID),
                       new SqlParameter("@BrandID", model!.brand == null ? 0 : model!.brand.ID),
                       new SqlParameter("@AllOriginal", model!.pfngm!.AllOriginal),
                       new SqlParameter("@AllAnalogue", model!.pfngm!.AllAnalogue),
                       new SqlParameter("@CopyFTP", model!.copyFTP),
                       new SqlParameter("@RecordsQty", model!.recordsQty),
                       new SqlParameter("@FieldsQty", model!.fieldsQty)
                   });
            }

            internal static void truncatePricesCreateFilesInside(Query query)
            {
                query.ExecuteNonQuery("[truncate_prices_create_files_inside]", new SqlParameter[] {});
            }
        }
    }
}
