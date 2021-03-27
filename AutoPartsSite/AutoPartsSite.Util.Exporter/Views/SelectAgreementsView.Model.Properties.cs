using ReactiveUI;
using System.Collections.Generic;
using AutoPartsSite.Util.Exporter.Models;
using System.Collections.ObjectModel;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class SelectAgreementsViewModel
    {
        public override string Header => "Выбор настроек";
        public override string Description => "Выберите настройки, по которым будет произведена выгрузка";

        private ObservableCollection<CompanyAgreementModel>? companyAgreements;
        public ObservableCollection<CompanyAgreementModel>? CompanyAgreements
        {
            get => companyAgreements;
            set => this.RaiseAndSetIfChanged(ref companyAgreements, value);
        }

    }
}
