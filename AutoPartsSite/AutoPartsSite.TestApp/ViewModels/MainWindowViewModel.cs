using Avalonia.Controls.Notifications;
using Avalonia.Threading;
using ReactiveUI;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

namespace AutoPartsSite.TestApp.ViewModels
{
    public class MainWindowViewModel : ViewModelBase
    {
        public MainWindowViewModel()
        {
            _this = this;
            //CurrentContent = new ConnectViewModel();
        }

        private static MainWindowViewModel _this = null;
        public static MainWindowViewModel This
        {
            get { if (_this == null) _this = new MainWindowViewModel(); return _this; }
        }

        private ViewModelBase _currentContent;
        [DataMember]
        public ViewModelBase CurrentContent
        {
            get => _currentContent;
            set => this.RaiseAndSetIfChanged(ref _currentContent, value);
        }

        internal WindowNotificationManager _notificationManager { get; set; }

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
