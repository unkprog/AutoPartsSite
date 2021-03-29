using ReactiveUI;
using AutoPartsSite.Util.Exporter.ViewModels;

namespace AutoPartsSite.Util.Exporter.Models
{
    public class CompanyAgreementModel : ViewModelBase
    {
        private bool? isSelected = false;
        public bool? IsSelected 
        {
            get => isSelected;
            set => this.RaiseAndSetIfChanged(ref isSelected, value);
        }
        
        public CompanyModel? Company { get; set; }
        public LanguageModel? Language { get; set; }
        public AgreementModel? Agreement { get; set; }
        public string? Translation { get; set; }

        public bool? PriceCaclulate { get; set; }
        public PriceFileFormatModel? PriceFileFormat { get; set; }
        public PriceFileCalcTypeModel? PriceFileCalcType { get; set; }
        public bool? PriceFileArchivate { get; set; }
        public int? PriceCurrencyID { get; set; }
    }
}
