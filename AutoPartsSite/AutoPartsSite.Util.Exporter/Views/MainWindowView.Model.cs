using AutoPartsSite.Core.Sql;
using AutoPartsSite.Util.Exporter.Models;
using AutoPartsSite.Util.Exporter.ViewModels;
using Avalonia.Controls.Notifications;
using Avalonia.Threading;
using System;
using System.Collections.ObjectModel;

namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class MainWindowViewModel : ViewModelBase
    {
        public MainWindowViewModel()
        {
            _this = this;
            CurrentContent = ConnectViewModel.This;
        }

        public void Prev()
        {
            if (_currentContent == null) return;
            Type t = _currentContent.GetType();
            if (_currentContent == SelectAgreementsViewModel.This) CurrentContent = ConnectViewModel.This;
            else if (_currentContent == ExportStateViewModel.This) CurrentContent = SelectAgreementsViewModel.This;
            else if (_currentContent == ExportFinishViewModel.This) CurrentContent = ExportStateViewModel.This;
        }

        public void Next()
        {
            if (_currentContent == null) return;

            if (!_currentContent.Validate()) return;


            if (_currentContent == ConnectViewModel.This)
            {
                SelectAgreementsViewModel.This.Load();
                CurrentContent = SelectAgreementsViewModel.This;
            }
            else if (_currentContent == SelectAgreementsViewModel.This)
            {
                CurrentContent = ExportStateViewModel.This;
                ExportStateViewModel.This.Setup(SelectAgreementsViewModel.This.CompanyAgreements!);
            }
            else if (_currentContent == ExportStateViewModel.This) CurrentContent = ExportFinishViewModel.This;
            else if (_currentContent == ExportFinishViewModel.This) CurrentContent = ConnectViewModel.This;

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

        public void SetQuery(Query query)
        {
            this.Query = query;
            Query.OnError = (ex) =>
            {
                NotifyError(ex.Message);
            };
        }

    }

}
