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
                    int i = 0;
                    CompanyAgreementModel item = new CompanyAgreementModel()
                    {
                        IsSelected = values[i++].ToBool(),
                        Company = new CompanyModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), OfficialNameEn = values[i++].ToStr(), OfficialNameRu = values[i++].ToStr() },
                        Language = new LanguageModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr() },
                        Agreement = new AgreementModel() { ID = values[i++].ToInt(), Code = Convert.ToString(values[i++]), DescrEn = values[i++].ToStr(), DescrRu = values[i++].ToStr() },
                        Translation = values[i++].ToStr().Trim(), PriceCaclulate = values[i++].ToBool(),
                        PriceFileFormat = new PriceFileFormatModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), DescrEn = values[i++].ToStr(), DescrRu = values[i++].ToStr() },
                        PriceFileCalcType = new PriceFileCalcTypeModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), DescrEn = values[i++].ToStr(), DescrRu = values[i++].ToStr() },
                        PriceFileArchivate = values[i++].ToBool(),
                        PriceCurrencyID = values[i++].ToInt(),
                        SeparatorSymbol = new SymbolModel() { ID = values[i++].ToInt(), Code = values[i++].ToDecimal(), Symbol = values[i++].ToStr() },
                        FractionalSymbol = new SymbolModel() { ID = values[i++].ToInt(), Code = values[i++].ToDecimal(), Symbol = values[i++].ToStr() },
                        AllBrandsOneFile = values[i++].ToBool(),
                        OneBrandOneFile = values[i++].ToBool(),
                        AnaloguesSeparateFile = values[i++].ToBool(),
                        TariffSeparateFile = values[i++].ToBool()
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
