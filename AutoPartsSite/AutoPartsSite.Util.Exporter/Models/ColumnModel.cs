namespace AutoPartsSite.Util.Exporter.Models
{
    public class ColumnModel
    {
        public int ID { get; set; }
        public decimal Index { get; set; }
        public string ColumnNameInside { get; set; } = string.Empty;
        public string ColumnNameClient { get; set; } = string.Empty;
        
    }
}
