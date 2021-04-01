using AutoPartsSite.Core.Extensions;
using ReactiveUI;
using System.Reactive;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class ConnectViewModel
    {
        //public ReactiveCommand<Unit, Unit> CheckConnectionCommand => ReactiveCommand.Create(() => { MainWindowViewModel.This.CurrentContent = App.Settings; });
        //public ReactiveCommand<Unit, Unit> AboutCommand => ReactiveCommand.Create(() => { MainWindowViewModel.This.CurrentContent = new AboutViewModel(); });

        public ReactiveCommand<Unit, Unit> CheckConnectionCommand => ReactiveCommand.Create(() =>
        {
            if (Validate())
            {
                bool result = false;
                MainWindowViewModel.This.Query?.ExecuteQuery("select [f] = cast(1 as bit)", null, null, (values) =>
                {
                    result = values[0].ToBool();
                });

                if(result)
                    MainWindowViewModel.This?.NotifyInfo("Соединение успешно установлено!");
                else
                    MainWindowViewModel.This?.NotifyError("Не удалось установить соединение...");
            }
        });

    }
}
