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


            internal string ArhivateFile(string exportPath, string fileName, string fileNameWithExt, string fileNameWithOutExt)
            {

                string fileNameZip = Path.Combine(exportPath, fileNameWithOutExt + ".zip");

                using (var zip = ZipFile.Open(fileNameZip, ZipArchiveMode.Create))
                {
                    var entry = zip.CreateEntry(fileName);
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

            internal void UnArhivateFile(string exportPath, string fileNameWithExt)
            {
                using (var zip = ZipFile.OpenRead(fileNameWithExt))
                {
                    zip.ExtractToDirectory(exportPath, true);
                }
            }

            internal void ArhivateFolder(string exportPath, string fileNameWithExt)
            {
                ZipFile.CreateFromDirectory(exportPath, fileNameWithExt);
            }

            internal char[] throwEscapeChars = null;
            internal string ReplaceEscapeChars(string? value)
            {
                string result = string.IsNullOrEmpty(value) ? string.Empty : value;

                if (throwEscapeChars == null)
                {
                    throwEscapeChars = new char[30];
                    for (int i = 0; i < 30; i++)
                        throwEscapeChars[i] = (char)i;
                }

                foreach (var c in throwEscapeChars)
                    result = result.Replace(c, ' ');
                return result.Replace("&", "&amp;").Replace("'", "&apos;").Replace(@"""", "&quot;").Replace(">", "&gt;").Replace("<", "&lt;");
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
