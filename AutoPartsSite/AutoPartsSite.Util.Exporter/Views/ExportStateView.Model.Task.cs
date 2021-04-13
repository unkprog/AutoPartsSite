using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Util.Exporter.Models;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.IO.Compression;
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
            private Core.Sql.Query query;
            private ExportCompanyAgreementModel expCAM;
            private Action<TaskExport> actionFinish;
            internal static readonly string pathExport = string.Concat(Environment.CurrentDirectory, @"\Settings\Export");
            public TaskExport(Core.Sql.Query q, ExportCompanyAgreementModel exp, Action<TaskExport> af)
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
                      List<string> files = new List<string>();
                      expCAM.Message = "Выполнение...";
                      if (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" || expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "txt")
                          files = ExportToCsv(expCAM);
                      else if (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "xls" || expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "xlsx")
                          files = ExportToExcel(expCAM);
                      else
                      {
                          expCAM.Message = "ОШИБКА: Не поддерживаемый формат " + expCAM.CompanyAgreement!.PriceFileFormat!.Code;
                          State = -1;
                      }

                      if (State > 0)
                      {

                          if (!string.IsNullOrEmpty(expCAM!.CompanyAgreement!.Agreement!.PriceFolder) && getTempFolder() != expCAM!.CompanyAgreement!.Agreement!.PriceFolder)
                          {
                              expCAM.Message = "Копирование файлов в выходной каталог...";
                              string folderTo = expCAM!.CompanyAgreement!.Agreement!.PriceFolder;
                              foreach (var file in files)
                              {
                                  if (!File.Exists(file))
                                      continue;

                                  FileInfo fi = new FileInfo(file);
                                  fi.MoveTo(string.Concat(folderTo, folderTo.EndsWith(@"\\") ? string.Empty : @"\\", fi.Name), true);
                              }
                          }

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

            private string getTempFolder()
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


            private void DeleteFiles(string folder)
            {
                if (Directory.Exists(folder))
                {
                    DirectoryInfo dir = new DirectoryInfo(folder);
                    FileInfo[] files = dir.GetFiles();

                    foreach (var f in files)
                    {
                        try { f.Delete(); } catch { }
                    }
                }
            }

            public void DeleteFiles()
            {
                DeleteFiles(getTempFolder());
                DeleteFiles(expCAM!.CompanyAgreement!.Agreement!.PriceFolder!);
            }

            private List<string> ExportToExcel(ExportCompanyAgreementModel model)
            {
                List<string> files = new List<string>();
                if (model!.CompanyAgreement!.OneBrandOneFile == true)
                {
                    expCAM.Message = "Получение списка брендов...";
                    
                    List<BrandModel>? brands = readSplitBrands(model);
                    foreach (BrandModel brand in brands)
                        files.Add(SaveToExcel(model, sqlCommand, brand, columns));
                }

                if (model!.CompanyAgreement.AllBrandsOneFile == true)
                    files.Add(SaveToExcel(model, sqlCommand, null, columns));

                return files;
            }

            private List<string> ExportToCsv(ExportCompanyAgreementModel model)
            {
                List<string> files = new List<string>();
                if (model!.CompanyAgreement!.OneBrandOneFile == true)
                {
                    expCAM.Message = "Получение списка брендов...";

                    List<BrandModel>? brands = readSplitBrands(model);
                    foreach (BrandModel brand in brands)
                        files.Add(SaveToCsv(model, sqlCommand, brand, columns));
                }

                if (model!.CompanyAgreement.AllBrandsOneFile == true)
                    files.Add(SaveToCsv(model, sqlCommand, null, columns));

                return files;
            }

            private string SaveToExcel(ExportCompanyAgreementModel model, string sqlCommand, BrandModel? brand, Dictionary<string, ColumnModel> columns)
            {
                string message = "Выгрузка в файл " + expCAM.CompanyAgreement!.PriceFileFormat!.DescrEn + (brand == null ? string.Empty : " (" + brand.Code + " -> " + brand.NonGenuine + " -> " + brand.DeliveryTariffID + ")");
                expCAM.Message = message + "...";
                string fileName = model!.CompanyAgreement!.Translation + (brand == null ? string.Empty : "{" + brand.Code + "_" + brand.NonGenuine + "_" + brand.DeliveryTariffID);
                string exportPath = getTempFolder();
                string fileNameWithExt = Path.Combine(exportPath, fileName + ".xlsx");

                string separatorSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorSymbol!.Symbol });
                string separatorReplaceSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorReplaceSymbol!.Symbol });

                int counter = 0;
                StringBuilder sb = new StringBuilder();
                List<ColumnModel> colList = columns.Values.ToList();

                string declareParams = "declare @CurrencyID int = " + model!.CompanyAgreement!.PriceCurrencyID;
                declareParams = declareParams + Environment.NewLine + "declare @BrandID int = " + (brand == null ? "null" : brand.ID.ToString());
                declareParams = declareParams + Environment.NewLine + "declare @NonGenuine int = " + (brand == null ? -1 : brand.NonGenuine).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @DeliveryTariffID int = " + (brand == null ? -1 : brand.DeliveryTariffID).ToString();

                File.WriteAllText(fileNameWithExt + ".sql", declareParams + Environment.NewLine + Environment.NewLine + sqlCommand);


                using (var workbook = SpreadsheetDocument.Create(fileNameWithExt, DocumentFormat.OpenXml.SpreadsheetDocumentType.Workbook))
                {
                    var workbookPart = workbook.AddWorkbookPart();
                    workbook.WorkbookPart.Workbook = new DocumentFormat.OpenXml.Spreadsheet.Workbook();
                    workbook.WorkbookPart.Workbook.Append(new BookViews(new WorkbookView()));

                    WorkbookStylesPart workbookStylesPart = workbook.WorkbookPart.AddNewPart<WorkbookStylesPart>("rIdStyles");
                    Stylesheet stylesheet = new Stylesheet();
                    workbookStylesPart.Stylesheet = stylesheet;
                    workbookStylesPart.Stylesheet.Save();

                    workbook.WorkbookPart.Workbook.Sheets = new DocumentFormat.OpenXml.Spreadsheet.Sheets();

                    //for (int tableIdx = 0; tableIdx < ds.Tables.Count; tableIdx++)
                    //{
                    //    DataTable table = ds.Tables[tableIdx];
                    var sheetPart = workbook.WorkbookPart.AddNewPart<WorksheetPart>();
                    var sheetData = new DocumentFormat.OpenXml.Spreadsheet.SheetData();
                    sheetPart.Worksheet = new DocumentFormat.OpenXml.Spreadsheet.Worksheet(sheetData);



                    DocumentFormat.OpenXml.Spreadsheet.Sheets sheets = workbook.WorkbookPart.Workbook.GetFirstChild<DocumentFormat.OpenXml.Spreadsheet.Sheets>();
                    string relationshipId = workbook.WorkbookPart.GetIdOfPart(sheetPart);
                    DocumentFormat.OpenXml.Spreadsheet.Sheet sheet = new DocumentFormat.OpenXml.Spreadsheet.Sheet();

                    sheet.Id = relationshipId;
                    sheet.SheetId = (uint)1; // (tableIdx + 1);   //If set to zero, Excel will display an error when opening the spreadsheet file.
                    sheet.Name = "Sheet 1"; // table.TableName;
                    sheets.Append(sheet);

                    DocumentFormat.OpenXml.Spreadsheet.Row headerRow = new DocumentFormat.OpenXml.Spreadsheet.Row();
                    foreach (var col in colList)
                    {
                        DocumentFormat.OpenXml.Spreadsheet.Cell cell = new DocumentFormat.OpenXml.Spreadsheet.Cell();
                        cell.DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String;
                        cell.CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(col.ColumnNameClient);
                        headerRow.AppendChild(cell);
                    }
                    sheetData.AppendChild(headerRow);

                    int countFields = colList.Count;
                    object val;

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

                            if (counter % 100 == 0)
                                expCAM.Message = message + " - " + counter + "...";

                            DocumentFormat.OpenXml.Spreadsheet.Row newRow = new DocumentFormat.OpenXml.Spreadsheet.Row();
                           
                            for (int i = 0, icount = countFields; i < icount; i++)
                        
                            {
                                val = values[i];
                                DocumentFormat.OpenXml.Spreadsheet.Cell cell = new DocumentFormat.OpenXml.Spreadsheet.Cell();
                                if (val.IsNull())
                                {
                                    cell.DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String;
                                    cell.CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(string.Empty);
                                }
                                else
                                {
                                    TypeCode typeCode = Type.GetTypeCode(val.GetType());
                                    try
                                    {
                                        switch (typeCode)
                                        {
                                            case System.TypeCode.Int16:
                                            case System.TypeCode.Int32:
                                            case System.TypeCode.Int64:
                                            case System.TypeCode.UInt16:
                                            case System.TypeCode.UInt32:
                                            case System.TypeCode.UInt64:
                                                cell.DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.Number;
                                                break;
                                            case System.TypeCode.Decimal:
                                            case System.TypeCode.Double:
                                            case System.TypeCode.Single:
                                                cell.DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.Number;
                                                break;
                                            case System.TypeCode.DateTime:
                                                cell.DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.Date;
                                                break;
                                            default:
                                                cell.DataType = DocumentFormat.OpenXml.Spreadsheet.CellValues.String;
                                                break;
                                        }
                                        if (typeCode == TypeCode.Decimal || typeCode == TypeCode.Double || typeCode == TypeCode.Single)
                                            cell.CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue(val.ToString()!.Replace(',', '.'));
                                        else
                                            cell.CellValue = new DocumentFormat.OpenXml.Spreadsheet.CellValue((colList[i].ReplaceSeparator ? val.ToString()!.Replace(separatorSymbol, separatorReplaceSymbol) : val.ToString()));
                                    }
                                    catch (Exception ex)
                                    {
                                        System.Diagnostics.Debug.WriteLine(ex.Message);
                                    }
                                }
                                newRow.AppendChild(cell);
                                i++;
                            }
                            sheetData.AppendChild(newRow);
                        }
                        , cmdTimeOut: 900);

                    sheetPart.Worksheet.Save();
                    workbook.WorkbookPart.Workbook.Save();
                }

                if (model.CompanyAgreement.PriceFileArchivate == true)
                {
                    string fileNameZip = Path.Combine(exportPath, fileName + ".zip");

                    using (var zip = ZipFile.Open(fileNameZip, ZipArchiveMode.Create))
                    {
                        var entry = zip.CreateEntry(fileName + ".xlsx");
                        entry.LastWriteTime = DateTimeOffset.Now;

                        using (var stream = File.OpenRead(fileNameWithExt))
                        {
                            using (var entryStream = entry.Open())
                                stream.CopyTo(entryStream);
                        }
                    }

                    try { File.Delete(fileNameWithExt); } catch { }
                    return fileNameZip;
                }

                return fileNameWithExt;
            }

            private string SaveToCsv(ExportCompanyAgreementModel model, string sqlCommand, BrandModel? brand, Dictionary<string, ColumnModel> columns)
            {
                string message = "Выгрузка в файл " + expCAM.CompanyAgreement!.PriceFileFormat!.DescrEn + (brand == null ? string.Empty : " (" + brand.Code + " -> " + brand.NonGenuine + " -> " + brand.DeliveryTariffID + ")");
                expCAM.Message = message + "...";
                string fileName = model!.CompanyAgreement!.Translation + (brand == null ? string.Empty : "{" + brand.Code + "_" + brand.NonGenuine + "_" + brand.DeliveryTariffID);
                string exportPath = getTempFolder();
                string fileNameWithExt = Path.Combine(exportPath, fileName + (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" ? ".csv" : ".txt"));

                int counter = 0;
                StringBuilder sb = new StringBuilder();
                List<ColumnModel> colList = columns.Values.ToList();

                string declareParams = "declare @CurrencyID int = " + model!.CompanyAgreement!.PriceCurrencyID;
                declareParams = declareParams + Environment.NewLine + "declare @BrandID int = " + (brand == null ? "null" : brand.ID.ToString());
                declareParams = declareParams + Environment.NewLine + "declare @NonGenuine int = " + (brand == null ? -1 : brand.NonGenuine).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @DeliveryTariffID int = " + (brand == null ? -1 : brand.DeliveryTariffID).ToString();

                File.WriteAllText(fileNameWithExt + ".sql", declareParams + Environment.NewLine + Environment.NewLine + sqlCommand);

                string separatorSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorSymbol!.Symbol });
                string separatorReplaceSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorReplaceSymbol!.Symbol });

                using (StreamWriter streamwriter = new StreamWriter(fileNameWithExt, true, Encoding.UTF8, 65536))
                {
                    foreach (var col in colList)
                    {
                        sb.Append(col.ColumnNameClient);
                        sb.Append(separatorSymbol);
                    }
                    streamwriter.WriteLine(sb.ToString());


                    NumberFormatInfo nfi = new NumberFormatInfo() { NumberDecimalSeparator = new string(new char[] { (char)model!.CompanyAgreement!.FractionalSymbol!.Symbol }) };
                    int countFields = colList.Count;
                    object val;

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
                            for(int i = 0, icount = countFields; i< icount; i++)
                            {
                                val = values[i];
                                sb.Append(Information.IsNumeric(val) ? (val.IsNull() ? string.Empty : Convert.ToDouble(val).ToString(nfi)) 
                                                                     : (colList[i].ReplaceSeparator ? val.ToString()!.Replace(separatorSymbol, separatorReplaceSymbol) : val.ToString()));
                                sb.Append(separatorSymbol);
                            }
                            streamwriter.WriteLine(sb.ToString());
                        }
                        , 900);
                }

                if (model.CompanyAgreement.PriceFileArchivate == true)
                {
                    string fileNameZip = Path.Combine(exportPath, fileName + ".zip");

                    using (var zip = ZipFile.Open(fileNameZip, ZipArchiveMode.Create))
                    {
                        var entry = zip.CreateEntry(fileName + (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" ? ".csv" : ".txt"));
                        entry.LastWriteTime = DateTimeOffset.Now;

                        using (var stream = File.OpenRead(fileNameWithExt))
                        {
                            using (var entryStream = entry.Open())
                                stream.CopyTo(entryStream);
                        }
                    }

                    try { File.Delete(fileNameWithExt); } catch { }
                    return fileNameZip;
                }
                return fileNameWithExt;
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
                            ColumnNameClient = values[3].ToStr().Trim(),
                            ReplaceSeparator = values[4].ToBool()
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
