using ReactiveUI;
using System.Collections.ObjectModel;
using AutoPartsSite.Util.Exporter.Models;
using System.Runtime.Serialization;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportStateViewModel
    {
        public static ExportStateViewModel This = new ExportStateViewModel();

        public override string Header => "Выгрузка";
        public override string Description => "Дождитесь окончания процесса выгрузки данных.";

        private ObservableCollection<ExportCompanyAgreementModel>? exportCompanyAgreements;
        public ObservableCollection<ExportCompanyAgreementModel>? ExportCompanyAgreements
        {
            get => exportCompanyAgreements;
            set => this.RaiseAndSetIfChanged(ref exportCompanyAgreements, value);
        }

        private string info = string.Empty;

        [DataMember]
        public string Info
        {
            get => info;
            set => this.RaiseAndSetIfChanged(ref info, value);
        }
    }
}
