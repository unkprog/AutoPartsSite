using AutoPartsSite.Util.Exporter.ViewModels;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ExportFinishViewModel
    {
        public static ExportFinishViewModel This = new ExportFinishViewModel();
        public override string Header => "Завершение";
        public override string Description => "Выгрузка данных завершена.";
    }
}
