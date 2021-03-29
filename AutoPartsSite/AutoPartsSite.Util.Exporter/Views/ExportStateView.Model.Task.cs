using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Util.Exporter.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
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
                      if (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv")
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


            private void ExportToCsv(ExportCompanyAgreementModel model)
            {
                Dictionary<string, ColumnModel> columns = readColumns(model!.CompanyAgreement!.PriceFileFormat!.ID);
                string sqlCommand = getSqlCommad(columns, model!.CompanyAgreement!.PriceCurrencyID, model!.CompanyAgreement!.PriceFileCalcType!.ID);

                File.WriteAllText(Path.Combine(pathExport, model!.CompanyAgreement!.Translation + ".sql"), sqlCommand);
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

            private string getSqlCommad(Dictionary<string, ColumnModel> columns, int? priceCurrencyID, int? priceFileCalcTypeID)
            {
                StringBuilder result = new StringBuilder();

                if(columns.Count > 0)
                {
                    var sort = columns.Values.ToList().OrderBy((x) => x.Index);
                    string selColumns = string.Empty;
                    string selColumnsPart = string.Empty;
                    string selColumnsCalcType = string.Empty;
                    foreach (ColumnModel col in sort)
                    {
                        selColumns = string.Concat(selColumns, string.IsNullOrEmpty(selColumns) ? string.Empty : ", ", "[", col.ColumnNameInside, "]");
                        if(col.ColumnNameInside.ToLower() != "Price" && col.ColumnNameInside.ToLower() != "StockQty")
                            selColumnsPart = string.Concat(selColumnsPart, string.IsNullOrEmpty(selColumnsPart) ? string.Empty : ", ", "[", col.ColumnNameInside, "]");
                        
                    }

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
                    result.AppendLine("  from [PricesCustomersInside] with(nolock)");
                    result.AppendLine("  where [CurrencyID] = @CurrencyID and [StockQty] <> 0");
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
                        result.AppendLine("where [qty].[StockQty] = [qty].[MaxStockQty]");
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
