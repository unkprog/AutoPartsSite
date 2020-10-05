using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace AutoPartSite.Core.IO
{
    public static class Helper
    {
        public static void ForEachDirectoryFiles(string path, string searchPattern, SearchOption searchOption, Action<FileInfo> action)
        {
            if (!Directory.Exists(path))
                return;

            if (action == null)
                return;

            DirectoryInfo di = new DirectoryInfo(path);
            FileInfo[] files = di.GetFiles(searchPattern, searchOption);

            if (files == null || files.Length == 0)
                return;

            foreach (var file in files)
            {
                action(file);
            }
        }

        public static string ReadFileAsString(string aFileName)
        {
            StringBuilder strBuilder = new StringBuilder();
            if (File.Exists(aFileName))
            {
                string line = "";

                using (FileStream fileStream = new FileStream(aFileName, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, false))
                {
                    using (StreamReader streamReader = new StreamReader(fileStream, Encoding.UTF8)) //.Default))
                    {
                        line = streamReader.ReadLine();
                        while (line != null)
                        {
                            strBuilder.AppendLine(line);
                            line = streamReader.ReadLine();
                        }
                    }
                    //fileStream.Close();
                }
            }
            return strBuilder.ToString();
        }
    }
}
