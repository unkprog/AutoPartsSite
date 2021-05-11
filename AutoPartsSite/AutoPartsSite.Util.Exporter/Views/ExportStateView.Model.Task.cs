using AutoPartsSite.Core.Extensions;
using AutoPartsSite.Util.Exporter.Models;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel
    {
        public partial class TaskExport 
        {
            private Core.Sql.Query query;
            private ExportCompanyAgreementModel expCAM;
            private Action<TaskExport> actionFinish;

            public TaskExport(Core.Sql.Query q, ExportCompanyAgreementModel exp, Action<TaskExport> af)
            {
                query = q;
                expCAM = exp;
                actionFinish = af;
            }

            public int State { get; set; }

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
                return "[BrandID], [BrandCode], [GoodsArticul], [GoodsDescrEn], [Price]"; // selColumnsIndex;  
            }

            public void Run()
            {
                State = 1;
                expCAM.Message = "Запуск...";
                _ = Task.Run(() =>
                  {
                      List<string> files = new List<string>();
                      expCAM.Message = "Выполнение...";
                      if (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" || expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "txt")
                          files = ExportToFile(expCAM, (model, brand, pcfim) => { return SaveToCsv(model, sqlCommand, brand, pcfim, columns); } );
                      else if (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "xls" || expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "xlsx")
                          files = ExportToFile(expCAM, (model, brand, pcfim) => { return SaveToExcel(model, sqlCommand, brand, pcfim, columns); });
                      else
                      {
                          expCAM.Message = "ОШИБКА: Не поддерживаемый формат " + expCAM.CompanyAgreement!.PriceFileFormat!.Code;
                          State = -1;
                      }

                      if (State > 0)
                      {
                          MoveFiles(files);
                          State = 2;
                          expCAM.Message = "Завершено...";
                      }

                      actionFinish?.Invoke(this);
                  });
            }

            private List<string> ExportToFile(ExportCompanyAgreementModel model, Func<ExportCompanyAgreementModel, BrandModel?, SavePricesCreateFilesInsideModel?, string> funcExportFile)
            {
                List<string> files = new List<string>();


                expCAM.Message = "Получение списка брендов...";
                List<BrandModel?>? brands = new List<BrandModel?>();
                if (model!.CompanyAgreement!.OneBrandOneFile == true)
                    brands = readSplitBrands(model);
                if (model!.CompanyAgreement.AllBrandsOneFile == true)
                    brands.Add(null);
                foreach (BrandModel? brand in brands)
                {
                    SavePricesCreateFilesInsideModel pcfim = new SavePricesCreateFilesInsideModel()
                    {
                        model = model,
                        brand = brand,
                        startDate = DateTime.Now,
                        pfngm = readPriceFileNameGetModel(model, brand),
                        copyFTP = !string.IsNullOrEmpty(expCAM!.CompanyAgreement!.Agreement!.PriceFolder) && getTempFolder() != expCAM!.CompanyAgreement!.Agreement!.PriceFolder,
                        status = "0"
                    };

                    try
                    {
                        files.Add(funcExportFile(model, brand, pcfim));
                    }
                    catch (Exception ex)
                    {
                        pcfim!.status = "-1";
                        pcfim!.comment = ex.Message;
                        //pcfim!.pfngm!.PriceFileName = "ERROR - " + pcfim.pfngm.PriceFileName;
                    }
                    pcfim.endDate = DateTime.Now;
                    try
                    {
                        savePricesCreateFilesInside(pcfim);
                    }
                    catch { }

                }

                return files;
            }

            private string SaveToExcel(ExportCompanyAgreementModel model, string sqlCommand, BrandModel? brand, SavePricesCreateFilesInsideModel? pcfim, Dictionary<string, ColumnModel> columns)
            {
                string message = "Выгрузка в файл " + expCAM.CompanyAgreement!.PriceFileFormat!.DescrEn + (brand == null ? string.Empty : " (" + brand.Code + " -> " + brand.NonGenuine + " -> " + brand.DeliveryTariffID + ")");
                expCAM.Message = message + "...";
                string fileName = model!.CompanyAgreement!.Translation + (brand == null ? string.Empty : "{" + brand.Code + "_" + brand.NonGenuine + "_" + brand.DeliveryTariffID);
                string exportPath = getTempFolder();
                if (pcfim!.pfngm == null)
                    pcfim.pfngm = new PriceFileNameGetModel();
                if (string.IsNullOrEmpty(pcfim.pfngm.PriceFileName))
                {
                    pcfim.pfngm.PriceFileNameWithoutExtension = fileName;
                    pcfim.pfngm.PriceFileName = fileName + ".xlsx";
                }
                string fileNameWithExt = Path.Combine(exportPath, pcfim.pfngm.PriceFileName);
                string fileNameWithOutExt = Path.Combine(exportPath, pcfim.pfngm.PriceFileNameWithoutExtension);

                string separatorSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorSymbol!.Symbol });
                string separatorReplaceSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorReplaceSymbol!.Symbol });

                int counter = 0;
                StringBuilder sb = new StringBuilder();
                List<ColumnModel> colList = columns.Values.ToList();
                int countFields = colList.Count;
                pcfim.fieldsQty = countFields;

                string declareParams = "declare @CurrencyID int = " + model!.CompanyAgreement!.PriceCurrencyID;
                declareParams = declareParams + Environment.NewLine + "declare @BrandID int = " + (brand == null ? "null" : brand.ID.ToString());
                declareParams = declareParams + Environment.NewLine + "declare @NonGenuine int = " + (brand == null ? -1 : brand.NonGenuine).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @DeliveryTariffID int = " + (brand == null ? -1 : brand.DeliveryTariffID).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @CustomerAgreementID int = " + (model!.CompanyAgreement!.Agreement!.ID).ToString();

                File.WriteAllText(fileNameWithExt + ".sql", declareParams + Environment.NewLine + Environment.NewLine + sqlCommand);

                object val;

                SpreadsheetDocument? spreadsheetDocument = null;
                WorkbookPart? workbookPart = null;
                Sheets? sheets = null;
                WorksheetPart? worksheetPart = null;
                SheetData? sheetData = null;
                Row? newRow = null;
                uint sheetId = 1;

                uint countSheetId = 0;
                StreamWriter? streamwriter = null;
                Action saveAndDisposeSpreadsheetDocument = () =>
                {
                    if (spreadsheetDocument != null)
                    {
                        worksheetPart?.Worksheet.Save();
                        spreadsheetDocument.WorkbookPart.Workbook.Save();
                        spreadsheetDocument.Close();
                        spreadsheetDocument.Dispose();
                        spreadsheetDocument = null;
                    }
                    if (streamwriter != null)
                    {
                        streamwriter.Write(@"</x:sheetData></x:worksheet>");
                        streamwriter!.Close();
                        streamwriter!.Dispose();
                        streamwriter = null;
                    }
                };

                query.ExecuteQuery(sqlCommand
                        , new SqlParameter[]
                        {
                            new SqlParameter("@CurrencyID", model!.CompanyAgreement!.PriceCurrencyID),
                            new SqlParameter("@BrandID", brand == null ? DBNull.Value : (object)brand.ID),
                            new SqlParameter("@CustomerAgreementID", model!.CompanyAgreement!.Agreement!.ID),
                            new SqlParameter("@NonGenuine", brand == null ? -1 : brand.NonGenuine),
                            new SqlParameter("@DeliveryTariffID", brand == null ? -1 : brand.DeliveryTariffID)
                        }
                        , null
                        , (values) =>
                        {

                            if (counter % 1000000 == 0 || spreadsheetDocument == null)
                            {
                                if (spreadsheetDocument != null)
                                {
                                    saveAndDisposeSpreadsheetDocument();
                                }

                                spreadsheetDocument = Helpers.OpenXML.CreateOrOpenSpreadsheetDocument(fileNameWithExt);
                                workbookPart = spreadsheetDocument.WorkbookPart;
                                sheets = spreadsheetDocument.WorkbookPart.Workbook.GetFirstChild<Sheets>();
                                sheetId = 0;
                                foreach (WorksheetPart worksheetpart in spreadsheetDocument.WorkbookPart.WorksheetParts)
                                {
                                    worksheetPart = worksheetpart;
                                    sheetId++;
                                }

                                sheetId++;
                                worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
                                sheets.Append(new Sheet() { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = sheetId, Name = "Sheet " + sheetId });

                                sheetData = new SheetData();
                                worksheetPart.Worksheet = new Worksheet(sheetData);

                                countSheetId = sheetId;

                                streamwriter = new StreamWriter(fileNameWithExt + "Sheet" + sheetId + ".xml" , true, Encoding.UTF8, 65536);

                                sb.Clear();
                                sb.Append(@"<?xml version=""1.0"" encoding=""utf-8""?>");
                                sb.Append(@"<x:worksheet xmlns:x=""http://schemas.openxmlformats.org/spreadsheetml/2006/main"">");
                                sb.Append(@"<x:sheetData>");
                                sb.Append(@"<x:row>");
                                for (int i = 0, icount = countFields; i < icount; i++)
                                {
                                    sb.Append(@"<x:c t=""str""><x:v>" + colList[i].ColumnNameClient + "</x:v></x:c>");
                                }
                                sb.Append(@"</x:row>");
                                streamwriter.Write(sb.ToString());
                            }

                            counter++;
                            if (counter % 100 == 0)
                                expCAM.Message = message + " - " + counter + "...";

                            sb.Clear();
                            sb.Append(@"<x:row>");
                            for (int i = 0, icount = countFields; i < icount; i++)
                            {
                                val = values[i];
                               

                                if (val.IsNull())
                                {
                                    sb.Append(@"<x:c t=""str""><x:v></x:v></x:c>");
                                }
                                else
                                {
                                    TypeCode typeCode = Type.GetTypeCode(val.GetType());
                                    try
                                    {
                                        if (typeCode == TypeCode.Decimal || typeCode == TypeCode.Double || typeCode == TypeCode.Single)
                                            sb.Append(@"<x:c t=""str""><x:v>" + val.ToString()!.Replace(',', '.') + "</x:v></x:c>");
                                        else if (typeCode == TypeCode.DateTime)
                                            sb.Append(@"<x:c t=""str""><x:v>" + val.ToDateTime().ToString("dd.MM.yyyy HH:mm:ss") + "</x:v></x:c>");
                                        else
                                            sb.Append(@"<x:c t=""str""><x:v>" + (colList[i].ReplaceSeparator ? val.ToString()!.Replace(separatorSymbol, separatorReplaceSymbol) : val.ToString()) + "</x:v></x:c>");
                                    }
                                    catch (Exception ex)
                                    {
                                        System.Diagnostics.Debug.WriteLine(ex.Message);
                                    }
                                }
                                
                            }
                            sb.Append(@"</x:row>");
                            streamwriter!.Write(sb.ToString());
                        }
                        , cmdTimeOut: 900);

                expCAM.Message = message + " - " + counter + "...";

                saveAndDisposeSpreadsheetDocument();

                pcfim.recordsQty = counter;


                string pathArc = Path.Combine(exportPath, Guid.NewGuid().ToString().Replace("-", string.Empty));
                if (!Directory.Exists(pathArc))
                    Directory.CreateDirectory(pathArc);
                UnArhivateFile(pathArc, fileNameWithExt);

                string pathArcSheet;
                for (int i = 0; i < countSheetId; i++)
                {
                    Directory.CreateDirectory(pathArc);
                    pathArcSheet = Path.Combine(pathArc, @"xl\worksheets\sheet" + (i + 1).ToString() + ".xml");

                    if (File.Exists(pathArcSheet))
                        File.Delete(pathArcSheet);
                    File.Move(fileNameWithExt + "Sheet" + (i + 1).ToString() + ".xml", pathArcSheet);
                }

                if (File.Exists(fileNameWithExt))
                    File.Delete(fileNameWithExt);


                ArhivateFolder(pathArc, fileNameWithExt);

                Directory.Delete(pathArc, true);

                if (model.CompanyAgreement.PriceFileArchivate == true)
                    return ArhivateFile(exportPath, pcfim.pfngm.PriceFileName, fileNameWithExt, fileNameWithOutExt);

                return fileNameWithExt;
            }


            //private string SaveToExcel1(ExportCompanyAgreementModel model, string sqlCommand, BrandModel? brand, SavePricesCreateFilesInsideModel? pcfim, Dictionary<string, ColumnModel> columns)
            //{
            //    string message = "Выгрузка в файл " + expCAM.CompanyAgreement!.PriceFileFormat!.DescrEn + (brand == null ? string.Empty : " (" + brand.Code + " -> " + brand.NonGenuine + " -> " + brand.DeliveryTariffID + ")");
            //    expCAM.Message = message + "...";
            //    string fileName = model!.CompanyAgreement!.Translation + (brand == null ? string.Empty : "{" + brand.Code + "_" + brand.NonGenuine + "_" + brand.DeliveryTariffID);
            //    string exportPath = getTempFolder();
            //    if (pcfim!.pfngm == null)
            //        pcfim.pfngm = new PriceFileNameGetModel();
            //    if (string.IsNullOrEmpty(pcfim.pfngm.PriceFileName))
            //    {
            //        pcfim.pfngm.PriceFileNameWithoutExtension = fileName;
            //        pcfim.pfngm.PriceFileName = fileName + ".xlsx";
            //    }
            //    string fileNameWithExt = Path.Combine(exportPath, pcfim.pfngm.PriceFileName);
            //    string fileNameWithOutExt = Path.Combine(exportPath, pcfim.pfngm.PriceFileNameWithoutExtension);

            //    string separatorSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorSymbol!.Symbol });
            //    string separatorReplaceSymbol = new string(new char[] { (char)model!.CompanyAgreement!.SeparatorReplaceSymbol!.Symbol });

            //    int counter = 0;
            //    StringBuilder sb = new StringBuilder();
            //    List<ColumnModel> colList = columns.Values.ToList();
            //    int countFields = colList.Count;
            //    pcfim.fieldsQty = countFields;

            //    string declareParams = "declare @CurrencyID int = " + model!.CompanyAgreement!.PriceCurrencyID;
            //    declareParams = declareParams + Environment.NewLine + "declare @BrandID int = " + (brand == null ? "null" : brand.ID.ToString());
            //    declareParams = declareParams + Environment.NewLine + "declare @NonGenuine int = " + (brand == null ? -1 : brand.NonGenuine).ToString();
            //    declareParams = declareParams + Environment.NewLine + "declare @DeliveryTariffID int = " + (brand == null ? -1 : brand.DeliveryTariffID).ToString();

            //    File.WriteAllText(fileNameWithExt + ".sql", declareParams + Environment.NewLine + Environment.NewLine + sqlCommand);
            //    object val;

            //    SpreadsheetDocument? spreadsheetDocument = null;
            //    WorkbookPart? workbookPart = null;
            //    Sheets? sheets = null;
            //    WorksheetPart? worksheetPart = null;
            //    SheetData? sheetData = null;
            //    Row? newRow = null;
            //    uint sheetId = 1;

            //    Action saveAndDisposeSpreadsheetDocument = () =>
            //    {
            //        if (spreadsheetDocument != null)
            //        {
            //            worksheetPart?.Worksheet.Save();
            //            spreadsheetDocument.WorkbookPart.Workbook.Save();
            //            spreadsheetDocument.Close();
            //            spreadsheetDocument.Dispose();
            //            spreadsheetDocument = null;
            //        }
            //    };

            //    query.ExecuteQuery(sqlCommand
            //            , new SqlParameter[]
            //            {
            //                new SqlParameter("@CurrencyID", model!.CompanyAgreement!.PriceCurrencyID),
            //                new SqlParameter("@BrandID", brand == null ? DBNull.Value : (object)brand.ID),
            //                new SqlParameter("@NonGenuine", brand == null ? -1 : brand.NonGenuine),
            //                new SqlParameter("@DeliveryTariffID", brand == null ? -1 : brand.DeliveryTariffID)
            //            }
            //            , null
            //            , (values) =>
            //            {

            //                if (counter % 200000 == 0 || spreadsheetDocument == null)
            //                {
            //                    if (spreadsheetDocument != null)
            //                    {
            //                        saveAndDisposeSpreadsheetDocument();
            //                        GC.Collect();
            //                        GC.WaitForPendingFinalizers();
            //                        GC.Collect();
            //                    }

            //                    spreadsheetDocument = Helpers.OpenXML.CreateOrOpenSpreadsheetDocument(fileNameWithExt);
            //                    workbookPart = spreadsheetDocument.WorkbookPart;
            //                    sheets = spreadsheetDocument.WorkbookPart.Workbook.GetFirstChild<Sheets>();
            //                    sheetId = 0;
            //                    foreach (WorksheetPart worksheetpart in spreadsheetDocument.WorkbookPart.WorksheetParts)
            //                    {
            //                        worksheetPart = worksheetpart;
            //                        sheetId++;
            //                    }

            //                    //if (worksheetPart == null || counter % 1000000 == 0)
            //                    //{
            //                        sheetId++;
            //                        worksheetPart = workbookPart.AddNewPart<WorksheetPart>();
            //                        sheets.Append(new Sheet() { Id = spreadsheetDocument.WorkbookPart.GetIdOfPart(worksheetPart), SheetId = sheetId, Name = "Sheet " + sheetId });

            //                        sheetData = new SheetData();
            //                        worksheetPart.Worksheet = new Worksheet(sheetData);
            //                    //}
            //                    //else
            //                    //{
            //                    //    sheetData = worksheetPart.Worksheet.GetFirstChild<SheetData>();
            //                    //}


            //                    newRow = new Row();
            //                    for (int i = 0, icount = countFields; i < icount; i++)
            //                        newRow.AppendChild(new Cell() { DataType = CellValues.String, CellValue = new CellValue(colList[i].ColumnNameClient) });

            //                    sheetData?.AppendChild(newRow);
            //                }

            //                counter++;
            //                if (counter % 100 == 0)
            //                    expCAM.Message = message + " - " + counter + "...";

            //                newRow = new Row();
            //                for (int i = 0, icount = countFields; i < icount; i++)
            //                {
            //                    val = values[i];
            //                    Cell cell = new Cell();

            //                    if (val.IsNull())
            //                    {
            //                        cell.DataType = CellValues.String;
            //                        cell.CellValue = new CellValue(string.Empty);
            //                    }
            //                    else
            //                    {
            //                        TypeCode typeCode = Type.GetTypeCode(val.GetType());
            //                        try
            //                        {
            //                            switch (typeCode)
            //                            {
            //                                case TypeCode.Int16:
            //                                case TypeCode.Int32:
            //                                case TypeCode.Int64:
            //                                case TypeCode.UInt16:
            //                                case TypeCode.UInt32:
            //                                case TypeCode.UInt64:
            //                                    cell.DataType = CellValues.Number;
            //                                    break;
            //                                case TypeCode.Decimal:
            //                                case TypeCode.Double:
            //                                case TypeCode.Single:
            //                                    cell.DataType = CellValues.Number;
            //                                    break;
            //                                case TypeCode.DateTime:
            //                                    cell.DataType = CellValues.Date;
            //                                    break;
            //                                default:
            //                                    cell.DataType = CellValues.String;
            //                                    break;
            //                            }
            //                            cell.DataType = CellValues.String;
            //                            if (typeCode == TypeCode.Decimal || typeCode == TypeCode.Double || typeCode == TypeCode.Single)
            //                                cell.CellValue = new CellValue(val.ToString()!.Replace(',', '.'));
            //                            else if (typeCode == TypeCode.DateTime)
            //                                cell.CellValue = new CellValue(val.ToDateTime().ToString("dd.MM.yyyy HH:mm:ss"));
            //                            else
            //                                cell.CellValue = new CellValue(colList[i].ReplaceSeparator ? val.ToString()!.Replace(separatorSymbol, separatorReplaceSymbol) : val.ToString());
            //                        }
            //                        catch (Exception ex)
            //                        {
            //                            System.Diagnostics.Debug.WriteLine(ex.Message);
            //                        }
            //                    }
            //                    newRow.AppendChild(cell);
            //                }
            //                sheetData?.AppendChild(newRow);
            //            }
            //            , cmdTimeOut: 900);

            //    expCAM.Message = message + " - " + counter + "...";

            //    saveAndDisposeSpreadsheetDocument();

            //    pcfim.recordsQty = counter;

            //    if (model.CompanyAgreement.PriceFileArchivate == true)
            //        return ArhivateFile(exportPath, pcfim.pfngm.PriceFileName, fileNameWithExt, fileNameWithOutExt);

            //    return fileNameWithExt;
            //}

            private string SaveToCsv(ExportCompanyAgreementModel model, string sqlCommand, BrandModel? brand, SavePricesCreateFilesInsideModel? pcfim, Dictionary<string, ColumnModel> columns)
            {
                string message = "Выгрузка в файл " + expCAM.CompanyAgreement!.PriceFileFormat!.DescrEn + (brand == null ? string.Empty : " (" + brand.Code + " -> " + brand.NonGenuine + " -> " + brand.DeliveryTariffID + ")");
                expCAM.Message = message + "...";
                string fileName = model!.CompanyAgreement!.Translation + (brand == null ? string.Empty : "{" + brand.Code + "_" + brand.NonGenuine + "_" + brand.DeliveryTariffID);
                string exportPath = getTempFolder();

                if (pcfim!.pfngm == null)
                    pcfim.pfngm = new PriceFileNameGetModel();
                if (string.IsNullOrEmpty(pcfim.pfngm.PriceFileName))
                {
                    pcfim.pfngm.PriceFileNameWithoutExtension = fileName;
                    pcfim.pfngm.PriceFileName = fileName + (expCAM.CompanyAgreement!.PriceFileFormat!.Code!.ToLower() == "csv" ? ".csv" : ".txt");
                }
                string fileNameWithExt = Path.Combine(exportPath, pcfim.pfngm.PriceFileName);
                string fileNameWithOutExt = Path.Combine(exportPath, pcfim.pfngm.PriceFileNameWithoutExtension);

                int counter = 0;
                StringBuilder sb = new StringBuilder();
                List<ColumnModel> colList = columns.Values.ToList();
                int countFields = colList.Count;
                pcfim.fieldsQty = countFields;

                string declareParams = "declare @CurrencyID int = " + model!.CompanyAgreement!.PriceCurrencyID;
                declareParams = declareParams + Environment.NewLine + "declare @BrandID int = " + (brand == null ? "null" : brand.ID.ToString());
                declareParams = declareParams + Environment.NewLine + "declare @NonGenuine int = " + (brand == null ? -1 : brand.NonGenuine).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @DeliveryTariffID int = " + (brand == null ? -1 : brand.DeliveryTariffID).ToString();
                declareParams = declareParams + Environment.NewLine + "declare @CustomerAgreementID int = " + (model!.CompanyAgreement!.Agreement!.ID).ToString();

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
                    object val;

                    query.ExecuteQuery(sqlCommand
                        , new SqlParameter[]
                        {
                            new SqlParameter("@CurrencyID", model!.CompanyAgreement!.PriceCurrencyID),
                            new SqlParameter("@BrandID", brand == null ? DBNull.Value : (object)brand.ID),
                            new SqlParameter("@CustomerAgreementID", model!.CompanyAgreement!.Agreement!.ID),
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
                            for(int i = 0, icount = countFields, lastCount = countFields - 1; i < icount; i++)
                            {
                                val = values[i];
                                if (val.IsNull())
                                    sb.Append(string.Empty);
                                else
                                {
                                    TypeCode typeCode = Type.GetTypeCode(val.GetType());
                                    try
                                    {
                                        if (typeCode == TypeCode.Decimal || typeCode == TypeCode.Double || typeCode == TypeCode.Single)
                                            sb.Append(Convert.ToDouble(val).ToString(nfi));
                                        else if (typeCode == TypeCode.DateTime)
                                            sb.Append(val.ToDateTime().ToString("dd.MM.yyyy HH:mm:ss"));
                                        else
                                            sb.Append((colList[i].ReplaceSeparator ? val.ToString()!.Replace(separatorSymbol, separatorReplaceSymbol) : val.ToString()));
                                    }
                                    catch (Exception ex)
                                    {
                                        System.Diagnostics.Debug.WriteLine(ex.Message);
                                    }
                                }
                                //sb.Append(Information.IsNumeric(val) ? (val.IsNull() ? string.Empty : Convert.ToDouble(val).ToString(nfi)) 
                                //                                     : (colList[i].ReplaceSeparator ? val.ToString()!.Replace(separatorSymbol, separatorReplaceSymbol) : val.ToString()));
                                if (i < lastCount) sb.Append(separatorSymbol);
                            }
                            streamwriter.WriteLine(sb.ToString());
                        }
                        , 900);
                }

                pcfim.recordsQty = counter;

                if (model.CompanyAgreement.PriceFileArchivate == true)
                    return ArhivateFile(exportPath, pcfim.pfngm.PriceFileName, fileNameWithExt, fileNameWithOutExt);

                return fileNameWithExt;
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
                    result.AppendLine("    and (@CustomerAgreementID is null or (not @CustomerAgreementID is null and [pci].[CustomerAgreementID] = @CustomerAgreementID))");
                    result.AppendLine("    and (@BrandID is null or (not @BrandID is null and [pci].[BrandID] = @BrandID))");
                    if (model!.CompanyAgreement!.PriceZeroQty == false)
                        result.AppendLine("    and [StockQty] <> 0");
                    if (model.CompanyAgreement.AnaloguesSeparateFile == true)
                        result.AppendLine("    and (@NonGenuine = -1 or (@NonGenuine <> -1 and [b].[NonGenuine] = @NonGenuine))");
                    if (model.CompanyAgreement.TariffSeparateFile == true)
                        result.AppendLine("    and (@DeliveryTariffID = -1 or (@DeliveryTariffID <> -1 and [pci].[DeliveryTariffID] = @DeliveryTariffID))");
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
