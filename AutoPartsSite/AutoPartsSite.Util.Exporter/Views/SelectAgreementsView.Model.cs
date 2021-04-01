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
                    CompanyAgreementModel item = new CompanyAgreementModel();

                    item.IsSelected = values[i++].ToBool();
                    item.Company = new CompanyModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), OfficialNameEn = values[i++].ToStr(), OfficialNameRu = values[i++].ToStr() };
                    item.Language = new LanguageModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr() };
                    item.Agreement = new AgreementModel() { ID = values[i++].ToInt(), Code = Convert.ToString(values[i++]), DescrEn = values[i++].ToStr(), DescrRu = values[i++].ToStr() };
                    item.Translation = values[i++].ToStr().Trim();
                    item.PriceCaclulate = values[i++].ToBool();
                    item.PriceFileFormat = new PriceFileFormatModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), DescrEn = values[i++].ToStr(), DescrRu = values[i++].ToStr() };
                    item.PriceFileCalcType = new PriceFileCalcTypeModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), DescrEn = values[i++].ToStr(), DescrRu = values[i++].ToStr() };
                    item.PriceZeroQty = values[i++].ToBool();
                    item.PriceFileArchivate = values[i++].ToBool();
                    item.PriceCurrencyID = values[i++].ToInt();
                    item.SeparatorSymbol = new SymbolModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), Symbol = values[i++].ToDecimal() };
                    item.FractionalSymbol = new SymbolModel() { ID = values[i++].ToInt(), Code = values[i++].ToStr(), Symbol = values[i++].ToDecimal() };
                    item.AllBrandsOneFile = values[i++].ToBool();
                    item.OneBrandOneFile = values[i++].ToBool();
                    item.AnaloguesSeparateFile = values[i++].ToBool();
                    item.TariffSeparateFile = values[i++].ToBool();

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
