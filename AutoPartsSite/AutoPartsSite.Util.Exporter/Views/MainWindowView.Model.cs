using AutoPartsSite.Util.Exporter.ViewModels;
using Avalonia.Controls.Notifications;
using Avalonia.Threading;
using System;


namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class MainWindowViewModel : ViewModelBase
    {
        public MainWindowViewModel()
        {
            _this = this;
            CurrentContent = new ConnectViewModel();
        }

        public void NotifyError(Exception ex)
        {
            Dispatcher.UIThread.InvokeAsync(() => _notificationManager?.Show(new Notification("Ошибка", ex.Message, NotificationType.Error)));
        }

        public void NotifyError(string message)
        {
            Dispatcher.UIThread.InvokeAsync(() => _notificationManager?.Show(new Notification("Ошибка", message, NotificationType.Error)));
        }

        public void NotifyInfo(string message)
        {
            Dispatcher.UIThread.InvokeAsync(() => _notificationManager?.Show(new Notification("Инфо", message, NotificationType.Information)));
        }

    }

}
