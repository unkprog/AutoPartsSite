using System;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Threading;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel
    {
        public partial class TaskExport
        {
            internal static string envDirectory
            {
                get
                {
                    Type t = typeof(ConnectViewModel);
                    string result = t.Assembly.Location;
                    result = result.Replace("\\" + t.Assembly.ManifestModule.Name, string.Empty);
                    return result;
                }
            }

            internal static readonly string pathExport = string.Concat(envDirectory, @"\Settings\Export");

            private void DeleteFiles(string folder)
            {
                if (Directory.Exists(folder))
                {
                    DirectoryInfo dir = new DirectoryInfo(folder);
                    FileInfo[] files = dir.GetFiles();
                    List<FileInfo> listFiles = new List<FileInfo>();

                    listFiles.AddRange(files);
                    int counter = 0;
                    while (listFiles.Count > 0 && counter < 60)
                    {
                        Thread.Sleep(1000);
                        files = listFiles.ToArray();
                        listFiles.Clear();
                        foreach (var f in files)
                        {
                            try
                            {
                                if (f.Exists)
                                    f.Delete();
                            }
                            catch
                            {
                                listFiles.Add(f);
                            }
                        }
                        counter++;
                    }
                }
            }

            public void DeleteFiles()
            {
                DeleteFiles(getTempFolder());
                DeleteFiles(expCAM!.CompanyAgreement!.Agreement!.PriceFolder!);
            }


            internal void MoveFiles(List<string> files)
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
            }


            internal string ArhivateFile(string exportPath, string fileNameWithExt)
            {

                string fileNameZip = Path.Combine(exportPath, fileNameWithExt + ".zip");

                using (var zip = ZipFile.Open(fileNameZip, ZipArchiveMode.Create))
                {
                    var entry = zip.CreateEntry(fileNameWithExt);
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


            const int CharCount = 26;
            const int CharBefore_A = 64;
            const int CharBefore_a = 96;

            public static string GetCell(int Row, int Column)
            {
                return string.Format("{0}{1}", GetColumnChar(Column, true), Row + 1);
            }
            public static string GetColumnChar(int aValue, bool StartAt0 = false)
            {
                int vDiv, vValue;
                char chr;
                string Result = string.Empty;
                vValue = aValue + (StartAt0 ? 1 : 0);
                vDiv = CharCount;// LengthOfArray(ColumnCharExcel);
                do
                {
                    vValue--;
                    chr = (char)(CharBefore_A + 1 + vValue % vDiv);
                    vValue = vValue / vDiv;
                    Result = chr + Result;
                }
                while (vValue > 0);
                return Result;
            }
        }
    }
}
