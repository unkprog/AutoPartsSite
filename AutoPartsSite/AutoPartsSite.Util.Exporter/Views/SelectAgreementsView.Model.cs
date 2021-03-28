using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using AutoPartsSite.Util.Exporter.Models;
using AutoPartsSite.Util.Exporter.ViewModels;
using ReactiveUI;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class SelectAgreementsViewModel : MasterViewModel
    {
        public SelectAgreementsViewModel()
        {
           
        }


        public ObservableCollection<CompanyAgreementModel> Load()
        {
            ObservableCollection<CompanyAgreementModel> list = new ObservableCollection<CompanyAgreementModel>();
            

            MainWindowViewModel.This?.Query?.Execute("[list]", null, null
                , (values) =>
                {
                    CompanyAgreementModel item = new CompanyAgreementModel()
                    {
                        Company = new CompanyModel() { ID = Convert.ToInt32(values[0]), Code = Convert.ToString(values[1]), OfficialNameEn = Convert.ToString(values[2]), OfficialNameRu = Convert.ToString(values[3]) },
                        Language = new LanguageModel() { ID = Convert.ToInt32(values[4]), Code = Convert.ToString(values[5]) },
                        Agreement = new AgreementModel() { ID = Convert.ToInt32(values[6]), Code = Convert.ToString(values[7]), DescrEn = Convert.ToString(values[8]), DescrRu = Convert.ToString(values[9]) },
                        Translation = Convert.ToString(values[10]), PriceCaclulate = Convert.ToBoolean(values[11]),
                        PriceFileFormat = new PriceFileFormatModel() { ID = Convert.ToInt32(values[12]), Code = Convert.ToString(values[13]), DescrEn = Convert.ToString(values[14]), DescrRu = Convert.ToString(values[15]) },
                        PriceFileCalcType = new PriceFileCalcTypeModel() { ID = Convert.ToInt32(values[16]), Code = Convert.ToString(values[17]), DescrEn = Convert.ToString(values[18]), DescrRu = Convert.ToString(values[19]) },
                        PriceFileArchivate = Convert.ToBoolean(values[20])
                    };
                    list.Add(item);
                });

            CompanyAgreements = list;

            return list;
        }

        public override bool Validate()
        {
            bool result = base.Validate();
            string errorMessage = string.Empty;
            if (result)
            {
                if (CompanyAgreements?.FirstOrDefault(f => f.IsSelected == true) == null)
                    errorMessage = "Не выбрано ни одной настройки для экспорта...";
            }

            if(!string.IsNullOrEmpty(errorMessage))
                MainWindowViewModel.This?.NotifyError(errorMessage);


            result = result && string.IsNullOrEmpty(errorMessage);

            return result;
        }
    }
}
