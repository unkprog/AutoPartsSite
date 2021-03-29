using System;
using System.Linq;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using AutoPartsSite.Util.Exporter.Models;
using AutoPartsSite.Util.Exporter.ViewModels;
using ReactiveUI;
using AutoPartsSite.Core.Extensions;

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
                        IsSelected = true,
                        Company = new CompanyModel() { ID = values[0].ToInt(), Code = values[1].ToStr(), OfficialNameEn = values[2].ToStr(), OfficialNameRu = values[3].ToStr() },
                        Language = new LanguageModel() { ID = values[4].ToInt(), Code = values[5].ToStr() },
                        Agreement = new AgreementModel() { ID = values[6].ToInt(), Code = Convert.ToString(values[7]), DescrEn = values[8].ToStr(), DescrRu = values[9].ToStr() },
                        Translation = values[10].ToStr(), PriceCaclulate = values[11].ToBool(),
                        PriceFileFormat = new PriceFileFormatModel() { ID = values[12].ToInt(), Code = values[13].ToStr(), DescrEn = values[14].ToStr(), DescrRu = values[15].ToStr() },
                        PriceFileCalcType = new PriceFileCalcTypeModel() { ID = values[16].ToInt(), Code = values[17].ToStr(), DescrEn = values[18].ToStr(), DescrRu = values[19].ToStr() },
                        PriceFileArchivate = values[20].ToBool(),
                        PriceCurrencyID = values[21].ToInt()
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
