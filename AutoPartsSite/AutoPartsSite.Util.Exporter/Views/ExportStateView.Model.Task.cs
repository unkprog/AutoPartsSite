using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Util.Exporter.Models;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel
    {
        public class TaskExport 
        {
            private Query query;
            private ExportCompanyAgreementModel expCAM;
            private Action<TaskExport> actionFinish;
            internal static readonly string pathExport = string.Concat(Environment.CurrentDirectory, @"\Settings\Export");
            public TaskExport(Query q, ExportCompanyAgreementModel exp, Action<TaskExport> af)
            {
                query = q;
                expCAM = exp;
                actionFinish = af;
            }

            public int State { get; set; }

            public void Run()
            {
                State = 1;
                expCAM.Message = "Запуск...";
                _ = Task.Run(() =>
                  {
                      expCAM.Message = "Выполнение...";
                      if (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" || expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "txt")
                          ExportToCsv(expCAM);
                      else
                      {
                          expCAM.Message = "ОШИБКА: Не поддерживаемый формат " + expCAM.CompanyAgreement!.PriceFileFormat!.Code;
                          State = -1;
                      }

                      if (State > 0)
                      {
                          State = 2;
                          expCAM.Message = "Завершено...";
                      }
                      actionFinish?.Invoke(this);
                  });
            }

            Dictionary<string, ColumnModel> columns = new Dictionary<string, ColumnModel>();
            string sqlCommand = string.Empty, selColumnsIndex = string.Empty;

            public void Prepare()
            {
                expCAM.Message = "Чтение столбцов...";
                columns = readColumns(expCAM!.CompanyAgreement!.PriceFileFormat!.ID);
                expCAM.Message = "Формирование SQL команды...";
                selColumnsIndex = string.Empty;
                sqlCommand = getSqlCommad(columns, expCAM);

                File.WriteAllText(Path.Combine(pathExport, expCAM!.CompanyAgreement!.Translation + ".sql"), sqlCommand);
                expCAM.Message = "Ожидание выполнения...";
            }

            public string GetSqlCommandIndex()
            {

                return selColumnsIndex;  
            }

            private void ExportToCsv(ExportCompanyAgreementModel model)
            {

                if (model!.CompanyAgreement!.OneBrandOneFile == true)
                {
                    expCAM.Message = "Получение списка брендов...";
                    
                    List<BrandModel>? brands = readSplitBrands(model);
                    foreach (BrandModel brand in brands)
                        SaveToCsv(model, sqlCommand, brand, columns);
                }

                if (model!.CompanyAgreement.AllBrandsOneFile == true)
                    SaveToCsv(model, sqlCommand, null, columns);
            }

            private void SaveToCsv(ExportCompanyAgreementModel model, string sqlCommand, BrandModel? brand, Dictionary<string, ColumnModel> columns)
            {
                string message = "Выгрузка в файл " + expCAM.CompanyAgreement!.PriceFileFormat!.DescrEn + (brand == null ? string.Empty : " (" + brand.Code + " -> " + brand.NonGenuine + " -> " + brand.DeliveryTariffID + ")");
                expCAM.Message = message + "...";
                string fileName = Path.Combine(pathExport, model!.CompanyAgreement!.Translation + (brand == null ? string.Empty : "{" + brand.Code + "_" + brand.NonGenuine + "_" + brand.DeliveryTariffID) + (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" ? ".csv" : ".txt"));

                int counter = 0;
                StringBuilder sb = new StringBuilder();
                List<ColumnModel> colList = columns.Values.ToList();

                string declareParams = "declare @CurrencyID int = " + model!.CompanyAgreement!.PriceCurrencyID;
                declareParams = declareParams + Environment.NewLine + "declare @BrandID int = " + (brand == null ? "null" : brand.ID.ToString());
                declareParams = declareParams + Environment.NewLine + "declare @NonGenuine int = " + (brand == null ? -1 : brand.NonGenuine).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @DeliveryTariffID int = " + (brand == null ? -1 : brand.DeliveryTariffID).ToString();

                File.WriteAllText(fileName + ".sql", declareParams + Environment.NewLine + Environment.NewLine + sqlCommand);


                using (StreamWriter streamwriter = new StreamWriter(fileName, true, Encoding.UTF8, 65536))
                {
                    foreach (var col in colList)
                    {
                        sb.Append(col.ColumnNameClient);
                        sb.Append(model!.CompanyAgreement!.SeparatorSymbol!.Code);
                    }
                    streamwriter.WriteLine(sb.ToString());

                    NumberFormatInfo nfi = new NumberFormatInfo();
                    nfi.NumberDecimalSeparator = model!.CompanyAgreement!.FractionalSymbol!.Code;

                    query.ExecuteQuery(sqlCommand
                        , new SqlParameter[]
                        {
                            new SqlParameter("@CurrencyID", model!.CompanyAgreement!.PriceCurrencyID),
                            new SqlParameter("@BrandID", brand == null ? DBNull.Value : (object)brand.ID),
                            new SqlParameter("@NonGenuine", brand == null ? -1 : brand.NonGenuine),
                            new SqlParameter("@DeliveryTariffID", brand == null ? -1 : brand.DeliveryTariffID)
                        }
                        , null
                        , (values) =>
                        {
                            counter++;

                            if(counter %100 == 0)
                                expCAM.Message = message + " - " + counter + "...";
                            sb.Clear();
                            foreach(var val in values)
                            {
                                sb.Append(Information.IsNumeric(val) ? (val.IsNull() ? string.Empty : Convert.ToDouble(val).ToString(nfi)) : val.ToString());
                                sb.Append(model!.CompanyAgreement!.SeparatorSymbol!.Code);
                            }
                            streamwriter.WriteLine(sb.ToString());
                        });
                }

            }

            private List<BrandModel> readSplitBrands(ExportCompanyAgreementModel model)
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
                            ColumnNameClient = values[3].ToStr().Trim()
                        };
                        if (!result.ContainsKey(col.ColumnNameInside))
                            result.Add(col.ColumnNameInside, col);
                    });

                return result;
            }

            private string getSqlCommad(Dictionary<string, ColumnModel> columns, ExportCompanyAgreementModel model)
            {
                StringBuilder result = new StringBuilder();
                selColumnsIndex = string.Empty;
                if (columns.Count > 0)
                {
                    var sort = columns.Values.ToList().OrderBy((x) => x.Index);
                    string selColumns = string.Empty, colName;
                    string selColumnsPart = string.Empty;
                    string selColumnsCalcType = string.Empty;
                    
                    foreach (ColumnModel col in sort)
                    {
                        colName = col.ColumnNameInside;
                        selColumns = string.Concat(selColumns, string.IsNullOrEmpty(selColumns) ? string.Empty : ", ", "[", colName, "]");
                        if(colName != "Price" && colName != "StockQty")
                            selColumnsPart = string.Concat(selColumnsPart, string.IsNullOrEmpty(selColumnsPart) ? string.Empty : ", ", "[", colName, "]");
                        if (colName != "CurrencyID" && colName != "StockQty")
                            selColumnsIndex = string.Concat(selColumnsIndex, string.IsNullOrEmpty(selColumnsIndex) ? string.Empty : ", ", "[", colName, "]");
                    }

                    if (!columns.ContainsKey("BrandID"))
                        selColumnsIndex = string.Concat(selColumnsIndex, string.IsNullOrEmpty(selColumnsIndex) ? string.Empty : ", ", "[BrandID]");

                    if (model!.CompanyAgreement!.TariffSeparateFile == true)
                        if (!columns.ContainsKey("DeliveryTariffID"))
                            selColumnsIndex = string.Concat(selColumnsIndex, string.IsNullOrEmpty(selColumnsIndex) ? string.Empty : ", ", "[DeliveryTariffID]");

                    int? priceFileCalcTypeID = model!.CompanyAgreement!.PriceFileCalcType!.ID;
                    
                    if (priceFileCalcTypeID == 2)
                    {
                        if (!columns.ContainsKey("Price"))
                            selColumnsCalcType = string.Concat(selColumnsCalcType, ", [Price]");
                        if (!columns.ContainsKey("StockQty"))
                            selColumnsCalcType = string.Concat(selColumnsCalcType, ", [StockQty]");
                    }


                    result.AppendLine(";with [query] as");
                    result.AppendLine("(");
                    result.AppendLine("  select " + selColumns + selColumnsCalcType);
                    result.AppendLine("  from [PricesCustomersInside] [pci] with(nolock)");
                    if (model.CompanyAgreement.AnaloguesSeparateFile == true)
                        result.AppendLine("  left join [Brands] [b] with(nolock) on [pci].[BrandID] = [b].[BrandID]");
                    result.AppendLine("  where [CurrencyID] = @CurrencyID");
                    if (model!.CompanyAgreement!.PriceZeroQty == false)
                        result.AppendLine("   and [StockQty] <> 0");
                    result.AppendLine("   and (@BrandID is null or (not @BrandID is null and [pci].[BrandID] = @BrandID))");
                    if (model.CompanyAgreement.AnaloguesSeparateFile == true)
                        result.AppendLine("   and (@NonGenuine = -1 or (@NonGenuine <> -1 and [b].[NonGenuine] = @NonGenuine))");
                    if (model.CompanyAgreement.TariffSeparateFile == true)
                        result.AppendLine("   and (@DeliveryTariffID = -1 or (@DeliveryTariffID <> -1 and [pci].[DeliveryTariffID] = @DeliveryTariffID))");
                    result.AppendLine(")");

                    if (priceFileCalcTypeID == 2)
                    {
                        result.AppendLine(", [price] as");
                        result.AppendLine("(");
                        result.AppendLine("  select " + selColumns + selColumnsCalcType);
                        result.AppendLine("       , [MinPrice] = min([Price]) over(partition by " + selColumnsPart + ")");
                        result.AppendLine("  from [query]");
                        result.AppendLine(")");
                        result.AppendLine(", [qty] as");
                        result.AppendLine("(");
                        result.AppendLine("  select " + selColumns + selColumnsCalcType);
                        result.AppendLine("       , [MaxStockQty] = max([StockQty]) over(partition by " + selColumnsPart + ")");
                        result.AppendLine("  from [price]");
                        result.AppendLine("  where [Price] = [MinPrice]");
                        result.AppendLine(")");
                        result.AppendLine("select distinct " + selColumns);
                        result.AppendLine("from [qty]");
                        result.AppendLine("where [StockQty] = [MaxStockQty]");
                        result.AppendLine("order by " + selColumns);
                    }
                    else if (priceFileCalcTypeID == 3)
                    {
                        result.AppendLine(", [qty] as");
                        result.AppendLine("(");
                        result.AppendLine("  select " + selColumns + selColumnsCalcType);
                        result.AppendLine("       , [MaxStockQty] = max([StockQty]) over(partition by " + selColumnsPart + ")");
                        result.AppendLine("  from [query]");
                        result.AppendLine(")");
                        result.AppendLine(", [price] as");
                        result.AppendLine("(");
                        result.AppendLine("  select " + selColumns + selColumnsCalcType);
                        result.AppendLine("       , [MinPrice] = min([Price]) over(partition by " + selColumnsPart + ")");
                        result.AppendLine("  from [qty]");
                        result.AppendLine("  where [StockQty] = [MaxStockQty]");
                        result.AppendLine(")");
                        result.AppendLine("select distinct " + selColumns);
                        result.AppendLine("from [price]");
                        result.AppendLine("where [Price] = [MinPrice]");
                        result.AppendLine("order by " + selColumns);
                    }
                    else
                    {
                        result.AppendLine("select " + selColumns);
                        result.AppendLine("from [query]");
                        result.AppendLine("order by " + selColumns);
                    }
                }
                return result.ToString();
            }
        }
    }
}
