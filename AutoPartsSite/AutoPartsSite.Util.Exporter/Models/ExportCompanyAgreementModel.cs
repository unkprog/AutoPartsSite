using ReactiveUI;
using AutoPartsSite.Util.Exporter.ViewModels;

namespace AutoPartsSite.Util.Exporter.Models
{
    public class ExportCompanyAgreementModel : ViewModelBase
    {
        private int? countRows = 0;
        public int? CountRows
        {
            get => countRows;
            set => this.RaiseAndSetIfChanged(ref countRows, value);
        }

        private string? message = string.Empty;
        public string? Message
        {
            get => message;
            set => this.RaiseAndSetIfChanged(ref message, value);
        }



        public CompanyAgreementModel? CompanyAgreement { get; set; }
      
    }
}
