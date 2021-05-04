using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;

namespace AutoPartsSite.Util.Exporter.Helpers
{
    public static class OpenXML
    {
        public static ImagePartType GetImagePartTypeByBitmap(Bitmap image)
        {
            if (ImageFormat.Bmp.Equals(image.RawFormat))
                return ImagePartType.Bmp;
            else if (ImageFormat.Gif.Equals(image.RawFormat))
                return ImagePartType.Gif;
            else if (ImageFormat.Png.Equals(image.RawFormat))
                return ImagePartType.Png;
            else if (ImageFormat.Tiff.Equals(image.RawFormat))
                return ImagePartType.Tiff;
            else if (ImageFormat.Icon.Equals(image.RawFormat))
                return ImagePartType.Icon;
            else if (ImageFormat.Jpeg.Equals(image.RawFormat))
                return ImagePartType.Jpeg;
            else if (ImageFormat.Emf.Equals(image.RawFormat))
                return ImagePartType.Emf;
            else if (ImageFormat.Wmf.Equals(image.RawFormat))
                return ImagePartType.Wmf;
            else
                throw new Exception("Image type could not be determined.");
        }


        public static SpreadsheetDocument CreateOrOpenSpreadsheetDocument(string fileName)
        {
            SpreadsheetDocument result;
            bool isExistsFile = File.Exists(fileName);
            if (isExistsFile)
            {
                result = SpreadsheetDocument.Open(fileName, true);
            }
            else
            {
                result = SpreadsheetDocument.Create(fileName, SpreadsheetDocumentType.Workbook);
                result.AddWorkbookPart().Workbook = new Workbook() { Sheets = new Sheets() };
            }
            return result;
        }
    }
}
