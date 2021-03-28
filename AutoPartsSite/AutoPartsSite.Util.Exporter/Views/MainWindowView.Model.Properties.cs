using System.Runtime.Serialization;
using AutoPartsSite.Core.Sql;
using AutoPartsSite.Util.Exporter.ViewModels;
using Avalonia.Controls.Notifications;
using ReactiveUI;


namespace AutoPartsSite.Util.Exporter.Views
{
    public partial class MainWindowViewModel
    {
        private static MainWindowViewModel? _this = null;
        public static MainWindowViewModel This
        {
            get { if (_this == null) _this = new MainWindowViewModel(); return _this; }
        }

        private MasterViewModel _currentContent = new MasterViewModel();
        [DataMember]
        public MasterViewModel CurrentContent
        {
            get => _currentContent;
            set { this.RaiseAndSetIfChanged(ref _currentContent, value); this.RaisePropertyChanged("IsNextEnable"); this.RaisePropertyChanged("IsPrevEnable"); }
        }

        private bool isDisable = false;
        [DataMember]
        public bool IsDisable
        {
            get => isDisable;
            set { this.RaiseAndSetIfChanged(ref isDisable, value); this.RaisePropertyChanged("IsNextEnable"); this.RaisePropertyChanged("IsPrevEnable"); }
        }

        [IgnoreDataMember]
        public Query? Query { get; private set; }

        [DataMember]
        public bool IsNextEnable => _currentContent == null || !isDisable;

        public bool IsPrevEnable => _currentContent == null || !isDisable || _currentContent.GetType() != typeof(ConnectViewModel);

        internal WindowNotificationManager? _notificationManager { get; set; }
    }
}
