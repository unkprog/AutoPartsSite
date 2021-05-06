using System;

namespace AutoPartsSite.Util.Exporter.Models
{
    public class SavePricesCreateFilesInsideModel
    {
        public ExportCompanyAgreementModel? model { get; set; }
        public BrandModel? brand { get; set; }
        public PriceFileNameGetModel? pfngm { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public bool copyFTP { get; set; }
        public int recordsQty { get; set; }
        public int fieldsQty { get; set; }
        public string status { get; set; } = string.Empty;
        public string comment { get; set; } = string.Empty;
    }
}
